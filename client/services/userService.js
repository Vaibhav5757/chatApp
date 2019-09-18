// (() => {
//     var app = angular.module("userApp");
//     app.factory('getUsers', async function getUsers($http) {

//         var self = {}

//         var contents = await $http.get("http://localhost:3000/users");

//         if(contents)self.data = contents.data.data;
//         else{
//             self.data = "No User found";
//         }
//         return self.data;
//     });
// })();

(() => {
    var app = angular.module("userApp");
    app.factory('getUsers', function getUsers($http) {

        return $http.get("http://localhost:3000/users")
        .then((response) => {
            return response.data.data;
        }).catch((err) => {
            console.log(err);
            return "No Users found";
        });

    });
})();