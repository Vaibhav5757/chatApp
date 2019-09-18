(() => {
    var app = angular.module("userApp");

    app.service('httpServices', function ($http) {
        this.getUsers = function () {
            return $http.get("http://localhost:3000/users")
                .then((response) => {
                    if (response.data.status) return response.data.data;
                }).catch((err) => {
                    return {};
                });
        }

        this.addUser = function (user) {
            return $http.post("http://localhost:3000/users/addUser", user)
        }
    })

})();