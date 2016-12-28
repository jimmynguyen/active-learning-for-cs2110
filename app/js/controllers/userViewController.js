(function() {

    "use strict";

    angular.module("app.controllers")

    .controller("UserViewController",
        function($scope,
            $location,
            $http,
            $cookies,
            $interval) {

            // set api url
            var API_URL = $cookies.get("apiUrl") + "/api";

            // functions to navigate between tabs
            $scope.setTab = function(newTab) {
                $scope.tab = newTab;
            };
            $scope.isSet = function(tabNum) {
                return $scope.tab === tabNum;
            };

            // functions to show or hide the explanation for questions
            $scope.isVisible = function(response) {
                var endId = $scope.getExplanationId(response);
                return $("#explanation-" + endId).css("display") === "none";
            };
            $scope.openExplanationModal = function(response) {
                $scope.explanationModal = {
                    response: response
                };
                $("#explanationModal").modal("show");
            };
            $scope.getExplanationId = function(response) {
                var endId = response.$$hashKey;
                var s = endId.split(":");
                return s[s.length - 1];

            };
            $scope.showExplanation = function(response) {
                var endId = $scope.getExplanationId(response);
                console.log("#explanation-" + endId);
                console.log($("#explanation-" + endId));
                $("#explanation-" + endId).toggle();
            };

            // functions for answering questions when there is an active session
            $scope.openQuestionModal = function(session) {
                $scope.questionModal = {
                    session: session,
                    question: session.question,
                    answers: session.answers,
                    module: session.question.module,
                };
                $("#questionModal").modal("show");
            };
            $scope.submitAnswer = function(answer) {
                // Highlight submitted answer.
                // Find targeted session index
                var session;
                for (var i in $scope.sessions) {
                    var s = $scope.sessions[i];
                    if (s.session_id === $scope.questionModal.session.session_id) {
                        session = s;
                        break;
                    }
                }

                if (session) {
                    // Submit answer via endpoint here.
                    $http.post(API_URL + "/response/addResponse?token=" + $cookies.get("token") + "&user_id=" + $scope.user.user_id + "&session_id=" + session.session_id + "&question_id=" + session.question.question_id + "&answer_id=" + answer.answer_id)
                        .success(function(response) {
                            console.log("Submitted answer.");
                            $scope.sessions[i].selectedAnswer = answer.answer_id;
                        }).error(function(response) {
                            console.log("Failed to submit answer.");
                        });
                }

                $("#questionModal").modal("hide");
            };
            $scope.getAnswerChoiceLetter = function(index) {
                return String.fromCharCode(65 + index);
            };

            // functions for reviewing old questions
            $scope.openPastQuestionModal = function(question) {
                $scope.pastQuestionModal = {
                    chosen_answer: -1,
                    question: question.question,
                    answers: question.answers,
                    module: question.module,
                    correct_answer_id: question.question.correct_answer_id
                };
                $("#pastQuestionModal").modal("show");
            };
            $scope.checkAnswer = function(answer) {
                $scope.pastQuestionModal.chosen_answer = answer.answer_id;
                if (answer.answer_id === $scope.pastQuestionModal.correct_answer_id) {
                    console.log("Right answer!");
                } else {
                    console.log("Wrong answer!");
                }
            };

            // functions to initialize page with data
            function getSession() {
                $http.get(API_URL + "/session/getActiveSessionInfo?token=" + $cookies.get("token"))
                    .success(function(sessions) {
                        $scope.sessions = sessions;
                    }).error(function(sessions) {
                        $scope.sessions = undefined;
                    });
            }
            function getUserStats() {
                $http.get(API_URL + "/stats/user?token=" + $cookies.get("token") + "&id=" + $scope.user.user_id)
                    .success(function(response) {
                        console.log(response);
                        $scope.responses = response.responses;
                        $scope.stats = response;
                    })
                    .error(function(response) {
                        console.log(response);
                    });
            }
            function getPastQuestions() {
                $http.get(API_URL + "/review/getQuestions?token=" + $cookies.get("token") + "&user_id=" + $scope.user.user_id)
                    .success(function(response) {
                        console.log("Got past questions.");
                        console.log(response);
                        $scope.pastQuestions = response;
                    })
                    .error(function(response) {
                        console.log("Could not get past questions - using a mock");
                    });
            }

            // initialize
            $scope.user = JSON.parse($cookies.get("user"));
            $scope.tab = 1;
            getUserStats();
            getSession();
            getPastQuestions();
        });

}());