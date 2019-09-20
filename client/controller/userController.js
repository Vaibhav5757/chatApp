(() => {
    var app = angular.module("userApp");

    app.controller("userController", userController);


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
         * @description: Select Reciever
         */
        this.selectReceiver = (email) => {
            this.receiver = email;
            // console.log(this.receiver);
        }

        /**
         * @description : Send Message
         */
        this.sendMessage = () => {
            var messageObject = {
                sender: "vaibhav@gmail.com",
                receiver: this.receiver,
                message: document.getElementById('message').value
            }

            //HTTP Service for sending a message
            httpServices.sendMessage(messageObject)
                .then((response) => {
                    if (response.data.status) {
                        this.conversation = response.data.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.displayMessage = err.data.error;
                })
        }
    }
})(); //IIFE - Immediately Invoked Function