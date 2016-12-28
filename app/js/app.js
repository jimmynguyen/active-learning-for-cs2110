(function () {

    "use strict";

    // create angular "app" module and dependencies
    angular.module("app", ["app.routes", "app.controllers", "app.filters", "app.services", "app.directives", "zingchart-angularjs"]);
    angular.module("app.routes", ["ngRoute"]);
    angular.module("app.controllers", ["ngCookies", "angular-md5"]);

}());