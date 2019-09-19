var app = angular.module("userApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: 'views/home.html'
        })
        .when("/signin", {
            templateUrl: 'views/signin.html',
            controller: 'userController as ctrl'
        })
        .when("/signup", {
            templateUrl: 'views/signup.html',
            controller: 'userController as ctrl'
        })
        .otherwise({
            templateUrl: 'views/home.html'
        })
});

