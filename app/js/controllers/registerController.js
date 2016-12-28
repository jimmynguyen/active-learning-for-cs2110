(function() {

    "use strict";

    angular.module("app.controllers")

    .controller("RegisterController",
        function($scope,
            $http,
            $location,
            $cookies) {

            // define HOST
            var HOST = $cookies.get("apiUrl");

            // function to create API URLs
            function args_to_url(host, api, json_args) {
                var retval = host + api + "?";

                for (var key in json_args) {
                    retval += key + "=" + json_args[key] + "&";
                }

                retval = retval.substring(0, retval.length - 1);

                return retval;
            }

            // function to register a user for an account
            $scope.register = function() {
                // Validate form client side
                // Post to endpoint.
                $http.post(args_to_url(HOST, "/account/create", {
                    "first_name": $scope.user.firstName,
                    "last_name": $scope.user.lastName,
                    "gt_username": $scope.user.gtUsername,
                    "email": $scope.user.email,
                    "password": $scope.user.password,
                })).then(function success(response) {
                    // Redirect to home page on success?
                    // If success, we authenticate and redirect to home page.
                    $scope.failedCreation = false;

                    $http.post(args_to_url(HOST, "/account/authenticate", {
                        "gt_username": $scope.user.gtUsername,
                        "password": $scope.user.password
                    })).then(function success(response) {
                        // Add token to cookies.
                        $cookies.put("token", response.data.token);
                        // Route to correct page.
                        if (response.data.admin) {
                            $location.path("/user"); // direct to /user
                        } else {
                            $location.path("/admin"); // direct to /admin
                        }

                    }, function error(response) {
                        // This should never happen.
                        console.log("Failed to login after account creation");
                        $location.path("/home");
                    });

                }, function error(response) {
                    // Inform user of the error on failure.
                    console.log("Failed to create account");
                    $scope.creationFailed = true;
                });
            };

            // initialize
            $scope.creationFailed = false;
            $scope.route = $location.path();
        });

}());