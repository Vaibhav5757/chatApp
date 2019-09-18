// (() => {
//     var app = angular.module("userApp");
    
//     app.controller("userController", userController);

//     async function userController(getUsers){
//         // this.users = "Rubbish Data";
//         this.users = await getUsers;
//         // console.log(this.users);
//     }
// })();

(() => {
    var app = angular.module("userApp");
    
    app.controller("userController", userController);

    function userController(getUsers){
        getUsers
        .then((response) => {
            this.users = response;
        })
    }
})();