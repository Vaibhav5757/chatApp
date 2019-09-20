(() => {
    var app = angular.module("userApp");

    /**
     * @description: Services to make http requests to server
     */
    app.service('httpServices', function($http) {

        /**
         * @description: Get Request to Server to fetch all data about all Users
         */
        this.getUsers = function() {
            return $http.get("http://localhost:3000/users")
                .then((response) => {
                    if (response.data.status) return response.data.data;
                }).catch((err) => {
                    return {};
                });
        }

        /**
         * @description: Post Request to Server to add a new User
         * @param {user}: User body which contains 
         */
        this.addUser = function(user) {
            return $http.post("http://localhost:3000/users/addUser", user)
        }

        /**
         * @description: Login user and return jwt token
         * @param {user}: User body with login details
         */
        this.logIn = function(user) {
            return $http.post("http://localhost:3000/users/login", user)
        }

        /**
         * @description: Forgot Password
         * @param {user}: Credentials of User who forgot his/her password
         */
        this.forgotPassword = function(user) {
            return $http.post("http://localhost:3000/users/forgotPassword", user)
        }

        /**
         * @description: Send Message
         */
        this.sendMessage = function(message) {
            return $http.post("http://localhost:3000/users/message", message)
        }
    })

})(); //IIFE - Immediately Invoked Function