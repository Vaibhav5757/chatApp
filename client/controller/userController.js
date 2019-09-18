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

            /**
             * @description: Give a http Request for posting
             * @param {user}: User details in an object
             */
            httpServices.addUser(user)
                .then((response) => {
                    if (response.data.status) this.displayMessage = "User Added";
                })
                .catch((err) => {
                    this.displayMessage = err.data.error;
                })
        }
    }
})();//IIFE - Immediately Invoked Function