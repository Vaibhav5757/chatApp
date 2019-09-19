(() => {
    var app = angular.module("userApp");

    app.controller("userController", userController);


    /**
     * @description: User Controller
     * @param {httpServices} Service to make http requests
     */
    function userController(httpServices) {

        /**
         * @description: get Data of All Users
         */
        this.getUsers = () => {

            // Display Data of All Users
            httpServices.getUsers()
                .then((response) => {
                    this.users = response;
                })
                .catch(() => {
                    this.users = {};//Empty Array to denote no users were fetched
                })
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
                    if (response.data.status) this.displayMessage = "User Added";
                })
                .catch((err) => {
                    this.displayMessage = err.data.error;
                })
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
                    if (response.data.status) this.displayMessage = "User Logged In";
                })
                .catch((err) => {
                    this.displayMessage = err.data.error;
                })
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
    }
})();//IIFE - Immediately Invoked Function