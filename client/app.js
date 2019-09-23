var app = angular.module("userApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: 'views/home.html',
            controller: 'userController as ctrl'
        })
        .when("/signin", {
            templateUrl: 'views/signin.html',
            controller: 'userController as ctrl'
        })
        .when("/signup", {
            templateUrl: 'views/signup.html',
            controller: 'userController as ctrl'
        })
        .when("/chats", {
            templateUrl: 'views/chats.html',
            controller: 'userController as ctrl'
        })
        .when("/resetPassword/:token", {
            templateUrl: "/views/resetPassword.html",
            controller: 'userController as ctrl',
            resolve:{
                result: function($route){
                    token =  $route.current.params.token;
                    if(token != null)return true;
                }
            }

        })
        .otherwise({
            redirectTo: '/'
        })
});

var socket = io.connect('http://localhost:3000');
