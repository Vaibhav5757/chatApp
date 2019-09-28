(() => {
    var app = angular.module("userApp");

    app.controller("userController", userController);

    var loggedInUser = null;
    var receiver = null;

    /**
     * @description: User Controller
     * @param {httpServices} Service to make http requests
     * @param{$location}: service which allows access to url in browser
     * @param{$scope} : Space alloted to Controller shared by all functions inside controller
     */
    function userController($scope, $location, httpServices) {

        /**
         * @description: get Data of All Users
         */
        httpServices.getUsers()
            .then((response) => {
                this.users = response.filter((users) => {
                    return loggedInUser != users.email;
                });
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
                    this.forgot = true;
                    if (response.data.status) this.displayMessage = "Check Mail Inbox";
                })
                .catch((err) => {
                    this.failed = true;
                    this.displayMessage = err.data.error;
                })
        }

        /**
         * @description: Reset Password
         */
        this.resetPassword = () => {
            var updateDetails = {
                password: this.password,
                confirmPassword: this.confirmPassword
            }

            //Make a http request to change password
            httpServices.resetPassword(updateDetails)
                .then((response) => {
                    if (response.data.status) {
                        this.success = true;
                        this.displayMessage = "Password Changed"
                    }
                })
                .catch((err) => {
                    this.failed = true;
                    console.log(err);
                    this.displayMessage = "Failed";
                })
        }

        /**
         * @description: Select Receiver
         */
        this.selectReceiver = (email) => {
            receiver = email;
            $scope.fetchChat();
        }

        /**
         * @description: Fetch Chat data between sender and Receiver
         * Sender will be loggedIn user whereas receiver will be selected user from button click
         * 
         * 
         *                  ******IMPORTANT******
         *            The use of $scope is necessary as you
         *            want to fetch and update chat both on
         *            sender side as well as on receiver side
         */
        $scope.fetchChat = () => {
            httpServices.fetchChat(loggedInUser, receiver)
                .then((response) => {
                    if (response.data.status) {
                        $scope.chat = response.data.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    $scope.chat = [err.data.error];
                })
        }

        /**
         * @description : Send Message
         */
        this.sendMessage = () => {
            var messageObject = {
                sender: loggedInUser,
                receiver: receiver,
                message: loggedInUser + ": " + document.getElementById('messageToBeSent').value
            }

            //HTTP Service for sending a message
            httpServices.sendMessage(messageObject);
        }

        /**
         * @description: Clear the message field when a message is sent
         */
        this.clearField = function () {
            document.getElementById("messageToBeSent").value = "";
        }

        //Refresh the chat after every message sent
        socket.on("message-received", function (data) {
            if ((data.sender === loggedInUser && data.receiver === receiver) ||
                (data.sender === receiver && data.receiver === loggedInUser)) {
                $scope.$apply(() => {
                    $scope.chat = data.conversation;
                })
            }
        })
    }
})(); //IIFE - Immediately Invoked Function