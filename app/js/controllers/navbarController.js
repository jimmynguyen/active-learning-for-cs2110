(function() {

    "use strict";

    angular.module("app.controllers")

    .controller("NavbarController",
        function($scope,
            $http,
            $location,
            $cookies) {

            // define HOST
            var HOST = $cookies.get("apiUrl");

            // initialize
            var sign_in_text = "Sign In";
            var sign_out_text = "Sign Out";
            var token_key = "token";
            var user_key = "user";
            $scope.logged_in = $cookies.get(token_key) !== undefined;
            $scope.buttontext = ($scope.logged_in) ? sign_out_text : sign_in_text;
            var error_style = {
                "border-bottom": "3px solid",
                "border-bottom-color": "#FF0000"
            };
            var no_error_style = {};
            $scope.form_style = no_error_style;
            $scope.route = $location.path();
            $scope.user = $cookies.getObject("user");

            // functions to login/logout
            $scope.login_or_logout = function() {
                if ($scope.logged_in) {
                    $scope.logout();
                } else {
                    $scope.login();
                }
            };
            $scope.logout = function() {
                // Delete token cookie.
                $cookies.remove(token_key);
                $cookies.remove(user_key);

                $scope.buttontext = sign_in_text;
                $scope.logged_in = false;

                $location.path("/");
            };
            $scope.login = function() {
                $http.post(HOST + "/account/authenticate?gt_username=" + $scope.username + "&password=" + $scope.password)
                    .then(function success(response) {
                        console.log(response);
                        $cookies.put(token_key, response.data.token);
                        $cookies.put(user_key, JSON.stringify(response.data.user));
                        $scope.logged_in = true;
                        $scope.buttontext = sign_out_text;
                        $scope.form_style = no_error_style;

                        if (response.data.admin) {
                            $location.path("/admin");
                        } else {
                            $location.path("/userView");
                        }

                    }, function error(response) {
                        console.log("Failed to authenticate.");
                        $scope.logged_in = false;
                        $scope.buttontext = sign_in_text;
                        $scope.form_style = error_style;
                    });
            };
        });

}());