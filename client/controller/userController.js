(() => {
    var app = angular.module("userApp");

    app.controller("userController", userController);

    function userController(httpServices) {

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

        //Add User
        this.addUser = () => {
            var user = {
                name: this.name,
                email: this.email,
                password: this.password,
                confirmPassword: this.confirmPassword
            }

            httpServices.addUser(user)
                .then((response) => {
                    if (response.data.status) this.displayMessage = "User Added";
                })
                .catch((err) => {
                    this.displayMessage = err.data.error;
                })
        }
    }
})();