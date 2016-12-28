(function () {

    "use strict";

    angular.module("app.routes")

    // define routes
    .config(function($routeProvider) {
        $routeProvider
        // home
        .when("/", {
            templateUrl: "templates/home.html",
            controller: "HomeController"
        })
        // user view
        .when("/user", {
            templateUrl: "templates/userView.html",
            controller: "UserViewController"
        })
        // user view
        .when("/userView", {
            redirectTo: "/user"
        })
        // admin view
        .when("/admin", {
            templateUrl: "templates/admin.html",
            controller: "AdminController"
        })
        // user account creation
        .when("/register", {
            templateUrl: "templates/register.html",
            controller: "RegisterController"
        })
        // default
        .otherwise({
            redirectTo: "/"
        });
    });

}());