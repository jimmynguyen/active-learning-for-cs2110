(function() {

    "use strict";

    angular.module("app.controllers")

    .controller("HomeController",
        function($scope,
            $location,
            $http,
            $cookies) {

            // set api url
            var API_URL = "http://localhost:3000";
            $cookies.put("apiUrl", API_URL);

        });

}());