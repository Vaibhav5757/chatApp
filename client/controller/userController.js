(() => {
    var app = angular.module("userApp");

    app.controller("userController", userController);

    var loggedInUser = null;

    /**
     * @description: User Controller
     * @param {httpServices} Service to make http requests
     */
    function userController($location, httpServices) {

        /**
         * @description: get Data of All Users
         */
        httpServices.getUsers()
            .then((response) => {
                this.users = response;
            })
            .catch(() => {
                this.users = {}; //Empty Array to denote no users were fetched
            })

        /**
         * @description: Re-direct to Sign Up Page
         */
        this.redirectSignUp = () => {
            $location.path("/signup")
        }

        /**
         * @description: Sign-Up operation
         */
        this.addUser = () => {

            //Create the User Object to send to server
            var user = {
                name: this.name,
                email: this.email,
                password: this.password,
                confirmPassword: this.confirmPassword
            }

            //Give a http Request for posting
            httpServices.addUser(user)
                .then((response) => {
                    if (response.data.status) {
                        this.displayMessage = "User Added";
                        $location.path("/signin");
                        this.failed = false;
                    } else this.failed = true;
                })
                .catch((err) => {
                    this.displayMessage = err.data.error;
                    this.failed = true;
                })
        }

        /**
         * @description: Re-direct to Log In Page
         */
        this.redirectSignIn = () => {
            $location.path("/signin")
        }

        /**
         * @description: User Login
         */
        this.logIn = () => {

            //Create the User Object to send to server
            var userCredentials = {
                email: this.email,
                password: this.password,
            }

            /**
             * Save the email of user who logged-in to remember
             * who will be the sender of messages
             */
            loggedInUser = this.email;


            //Give a http Request for logging in
            httpServices.logIn(userCredentials)
                .then((response) => {
                    if (response.data.status) {
                        this.displayMessage = "Logging in";
                        this.failed = false;
                        this.sender = userCredentials.email;
                        $location.path("/chats");
                    } else {
                        this.failed = true;
                    }
                })
                .catch((err) => {
                    this.failed = true;
                    this.displayMessage = err.data.error;
                })
            this.failed = true;
        }

        /**
         * @description: Forgot Password - Send a mail to User
         */
        this.forgotPassword = () => {
            var user = {
                email: this.email
            }

            //Service request for sending a mail on forgetting password
            httpServices.forgotPassword(user)
                .then((response) => {
                    if (response.data.status) this.displayMessage = "Check Mail Inbox";
                })
                .catch((err) => {
                    console.log(err);
                    this.displayMessage = err.data.error;
                })
        }

        /**
         * @description: Select Receiver
         */
        this.selectReceiver = (email) => {
            this.receiver = email;
            this.fetchChat();
        }

        /**
         * @description: Fetch Chat data between sender and Receiver
         * Sender will be loggedIn user whereas receiver will be selected user from button click
         */
        this.fetchChat = () => {
            httpServices.fetchChat(loggedInUser, this.receiver)
                .then((response) => {
                    if (response.data.status) {
                        this.chat = response.data.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.chat = [err.data.error];
                })
        }

        /**
         * @description : Send Message
         */
        this.sendMessage = () => {
            var messageObject = {
                sender: loggedInUser,
                receiver: this.receiver,
                message: loggedInUser + ": " + document.getElementById('message').value
            }

            //HTTP Service for sending a message
            httpServices.sendMessage(messageObject);
        }

        socket.on('message-received', function (data) {
            console.log("In Message-Received Handler Client Side ");
            httpServices.fetchChat(data.firstPerson, data.secondPerson)
                .then((response) => {
                    if (response.data.status) {
                        this.chat = response.data.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.chat = [err.data.error];
                })
        })
    }
})(); //IIFE - Immediately Invoked Function

