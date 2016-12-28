(function() {

    "use strict";

    angular.module("app.controllers")

    .controller("AdminController",
        function($scope,
            $location,
            $http,
            $cookies,
            $interval) {

            // set api url
            var API_URL = $cookies.get("apiUrl") + "/api";
            var API_TOKEN = $cookies.get("token");

            // functions to navigate betweent tabs
            $scope.setTab = function(newTab) {
                $scope.tab = newTab;
            };
            $scope.isSet = function(tabNum) {
                return $scope.tab === tabNum;
            };

            // functions to toggle divs
            $scope.toggleModule = function(index) {
                var spanElement = $("#module-span-" + index);
                if (spanElement.hasClass("glyphicon-triangle-bottom")) {
                    $("#module-table-" + index).hide();
                    $("#module-span-" + index).removeClass("glyphicon-triangle-bottom");
                    $("#module-span-" + index).addClass("glyphicon-triangle-right");
                } else {
                    $("#module-table-" + index).show();
                    $("#module-span-" + index).removeClass("glyphicon-triangle-right");
                    $("#module-span-" + index).addClass("glyphicon-triangle-bottom");
                }
            };
            $scope.toggleStudentPerformanceModule = function(index) {
                var spanElement = $("#studentPerformance-module-span-" + index);
                if (spanElement.hasClass("glyphicon-triangle-bottom")) {
                    $("#studentPerformance-module-table-" + index).hide();
                    $("#studentPerformance-module-span-" + index).removeClass("glyphicon-triangle-bottom");
                    $("#studentPerformance-module-span-" + index).addClass("glyphicon-triangle-right");
                } else {
                    $("#studentPerformance-module-table-" + index).show();
                    $("#studentPerformance-module-span-" + index).removeClass("glyphicon-triangle-right");
                    $("#studentPerformance-module-span-" + index).addClass("glyphicon-triangle-bottom");
                }
            };
            $scope.toggleStudentDetailedStatistics = function(user_id) {
                var id = "#studentPerformance-detailedStatistics-" + user_id;
                $(id).toggle();
            };

            // functions to create/read/update/delete questions
            $scope.openCrudModal = function(question, module) {
                $scope.crudModal = {
                    title: "Edit Question",
                    question: question,
                    module: module,
                    answers: null
                };

                $http.get(API_URL + "/answer/getAnswerChoices?token=" + API_TOKEN + "&question_id=" + question.question_id)
                    .success(function(response) {
                        $scope.crudModal.answers = response;

                    });

                $("#crudModal").modal({
                    show: true,
                    keyboard: false,
                    backdrop: "static"
                });
            };
            $scope.openAddModal = function(module) {
                $scope.crudModal = {
                    title: "Add Question",
                    question: {
                        question_id: null,
                        name: " ",
                        content: " ",
                        explanation: " ",
                    },
                    module: module,
                    answers: []
                };

                $http.post(API_URL + "/question/addQuestion?token=" + API_TOKEN + "&module_id=" + $scope.crudModal.module.module_id + "&name=" + $scope.crudModal.question.name + "&content=" + $scope.crudModal.question.content + "&explanation=" + $scope.crudModal.question.explanation + "&hack=hack")
                    .success(function(response) {
                        // TODO: make sure this works.
                        console.log(response);
                        $scope.crudModal.question.question_id = response.question_id;
                        $scope.crudModal.question.module_id = module.module_id;
                        $scope.questions.push($scope.crudModal.question);
                    }).error(function(response) {
                        // Somehow handle error here. Idk how.
                        console.log("error");
                        console.log(response);
                    });

                $("#crudModal").modal({
                    show: true,
                    keyboard: false,
                    backdrop: "static"
                });
            };
            $scope.updateAnswerIsCorrect = function(answer) {

                $http.put(API_URL + "/answer/setCorrect?token=" + API_TOKEN + "&answer_id=" + answer.answer_id)
                    .success(function(response) {
                        // Set field to indicate success.

                        for (var key in $scope.crudModal.answers) {
                            var ans = $scope.crudModal.answers[key];
                            if (ans.answer_id === answer.answer_id) {
                                ans.is_correct = 1;
                            } else {
                                ans.is_correct = 0;
                            }
                        }
                        console.log("Set success.");
                    }).error(function(response) {
                        // Set field back to original.
                        console.log("Failed to set success");
                    });
            };
            $scope.updateAnswerContent = function(event, answer) {
                if (!event.target.value || event.target.value === "") {
                    console.log("Deleting answer");
                    // Delete answer.
                    $http.delete(API_URL + "/answer/delete?token=" + API_TOKEN + "&answer_id=" + answer.answer_id)
                        .success(function(response) {
                            // Remove from answers array.
                            for (var i = 0; i < $scope.crudModal.answers.length; i++) {
                                if (answer.answer_id === $scope.crudModal.answers[i].answer_id) {
                                    // Remove the ith element, which is the one
                                    // that matches.
                                    console.log("Found the right answer to remove");
                                    $scope.crudModal.answers.splice(i, 1);
                                    $scope.crudModal.answers.$apply();
                                    break;
                                }
                            }

                        }).error(function(response) {
                            // Reset the input.
                            event.target.value = answer.content;
                        });
                } else if (event.target.value !== answer.content) {
                    $http.put(API_URL + "/answer/update?token=" + API_TOKEN + "&answer_id=" + answer.answer_id + "&field=content&value=" + event.target.value)
                        .success(function(response) {
                            answer.content = event.target.value;
                        }).error(function(response) {
                            event.target.value = answer.content;
                        });
                }
            };
            $scope.addAnswer = function() {
                var question = $scope.crudModal.question;
                var is_correct = $("#new-answer-is-correct").is(":checked") ? 1 : 0;
                var content = $("#new-answer-content").val();

                if (!content) {
                    return;
                }

                $http.post(API_URL + "/answer/addAnswer?token=" + API_TOKEN + "&question_id=" + question.question_id + "&is_correct=" + is_correct + "&content=" + content)
                    .success(function(response) {
                        console.log(response);
                        // Show on UI that answer is added.
                        $scope.crudModal.answers.push({
                            answer_id: response.answer_id,
                            content: content,
                            is_correct: is_correct
                        });

                        if (is_correct) {
                            $scope.updateAnswerIsCorrect(response);
                        }

                        $("#new-answer-content").val("");
                        $("#new-answer-is-correct").prop("checked", false);

                    }).error(function(response) {
                        // Do nothing.
                    });
            };
            $scope.deleteQuestion = function(question) {
                console.log("Deleting question...");
                $http.delete(API_URL + "/question/delete?token=" + API_TOKEN + "&question_id=" + question.question_id)
                    .success(function(response) {
                        // Remove from $scope.questions
                        for (var i = 0; i < $scope.questions.length; i++) {
                            if (question.question_id === $scope.questions[i].question_id) {
                                // Remove the ith element, which is the one
                                // that matches.
                                $scope.questions.splice(i, i);
                                break;
                            }
                        }
                    }).error(function(response) {
                        console.log("Failed to delete the question");
                    });

            };
            $scope.updateQuestion = function(event, field) {
                var question = $scope.crudModal.question;

                if (event.target.value !== question[field]) {
                    $http.put(API_URL + "/question/update?token=" + API_TOKEN + "&question_id=" + question.question_id + "&field=" + field + "&value=" + event.target.value)
                        .success(function(response) {
                            question[field] = event.target.value;
                        }).error(function(response) {
                            event.target.value = question[field];
                        });
                }
            };

            // functions to start accepting responses for a question
            $scope.openQuestionModal = function(question, module) {
                $scope.questionModal = {
                    question: question,
                    module: module,
                    answers: null,
                    totalResponseCount: 0,
                    timer: {
                        isRunning: false,
                        isStopped: false,
                        targetDate: 0,
                        timerInterval: null
                    }
                };
                getAnswers(question.question_id);

                $("#questionModal-timer").show();

                // reset timer to 05:00 mins
                $("#timer-minutes-ten").val("0");
                $("#timer-minutes-one").val("5");
                $("#timer-seconds-ten").val("0");
                $("#timer-seconds-one").val("0");

                $("#questionModal-answer").hide();

                $("#questionModal").modal({
                    show: true,
                    keyboard: false,
                    backdrop: "static"
                });
            };
            $scope.startTimer = function() {
                var minutes = parseInt($("#timer-minutes-ten").val() + $("#timer-minutes-one").val());
                var seconds = parseInt($("#timer-seconds-ten").val() + $("#timer-seconds-one").val());
                var timeAllotted = 1000 * (60 * minutes + seconds);
                if (timeAllotted > 0) {
                    $scope.questionModal.timer.targetDate = new Date().getTime() + timeAllotted;
                    $scope.questionModal.timer.isRunning = true;

                    $http.post(API_URL + "/session/create?token=" + API_TOKEN + "&question_id=" + $scope.questionModal.question.question_id)
                        .success(function(response) {
                            $scope.sessionId = response.session_id;
                        });

                    $scope.questionModal.timer.timerInterval = $interval(function() {
                        var currentDate = new Date().getTime();
                        var secondsLeft = ($scope.questionModal.timer.targetDate - currentDate) / 1000;
                        var minutes = parseInt(secondsLeft / 60);
                        var seconds = parseInt(secondsLeft % 60);
                        $("#timer-minutes-ten").val(parseInt(minutes / 10));
                        $("#timer-minutes-one").val(parseInt(minutes % 10));
                        $("#timer-seconds-ten").val(parseInt(seconds / 10));
                        $("#timer-seconds-one").val(parseInt(seconds % 10));
                        if (minutes <= 0 && seconds <= 0) {
                            $scope.stopTimer();
                        }
                    }, 1000);
                }
            };
            $scope.addFifteenSeconds = function() {
                $scope.questionModal.timer.targetDate += 15000;
            };
            $scope.minusFifteenSeconds = function() {
                $scope.questionModal.timer.targetDate -= 15000;
            };
            $scope.stopTimer = function() {
                $interval.cancel($scope.questionModal.timer.timerInterval);
                $scope.questionModal.timer.isRunning = false;
                $scope.questionModal.timer.isStopped = true;
                $http.put(API_URL + "/session/end?token=" + API_TOKEN + "&session_id=" + $scope.sessionId)
                    .success(function(response) {
                        $http.get(API_URL + "/stats/session?token=" + API_TOKEN + "&id=" + $scope.sessionId)
                            .success(function(response) {
                                $scope.questionModal.answers = response.responses;
                                $scope.questionModal.totalResponseCount = response.total_count;
                                $("#questionModal-timer").hide(function() {
                                    $("#questionModal-answer").show();
                                });
                            })
                            .error(function(error) {
                                console.log(error);
                                $("#questionModal-timer").hide(function() {
                                    $("#questionModal-answer").show();
                                });
                            });
                    });
            };
            $scope.getAnswerChoiceLetter = function(index) {
                return String.fromCharCode(65 + index);
            };

            // functions to edit users
            $scope.openEditUserModal = function(user) {
                $scope.editUserModal = {
                    user: $.extend(true, {}, user)
                };
                $("#editUserModal").modal({
                    show: true,
                    keyboard: false,
                    backdrop: "static"
                });
            };
            $scope.changeToInstructor = function(user_id) {
                $http.put(API_URL + "/user/makeAdmin?token=" + API_TOKEN + "&user_id=" + user_id)
                    .success(function(response) {
                        console.log(response);
                        getUsers();
                    });
                $("#editUserModal").modal("toggle");
            };
            $scope.openAddUserModal = function() {
                $scope.addUserModal = {
                    user: {
                        first_name: null,
                        last_name: null,
                        gt_username: null,
                        email: null,
                        user_type_id: null
                    }
                };
                $("#addUserModal").modal({
                    show: true,
                    keyboard: false,
                    backdrop: "static"
                });
            };
            $scope.addUser = function() {
                // do add user stuff
            };
            $scope.isInvalid = function(val) {
                return val === null || val === undefined || val.length === 0;
            };

            // functions to display statistics
            $scope.calculatePercentage = function(count, totalCount) {
                return (count / totalCount * 100).toFixed(1);
            };
            $scope.openQuestionStatisticsModal = function(question, module) {
                $scope.questionStatisticsModal = {
                    question: question,
                    module: module,
                    sessions: [],
                    totals: [],
                    totalsTotal: 0
                };
                getQuestionStatistics(question.question_id);
                $("#questionStatisticsModal").modal({
                    show: true,
                    keyboard: false,
                    backdrop: "static"
                });
            };
            $scope.openQuestionStatisticsHistogramModal = function(session) {
                var values, contents = [],
                    ndx;
                if (session === null) {
                    values = $scope.questionStatisticsModal.totals;
                    for (ndx = 0; ndx < $scope.questionStatisticsModal.sessions[0].responses.length; ndx++) {
                        contents.push($scope.questionStatisticsModal.sessions[0].responses[ndx].content);
                    }
                } else {
                    values = [];
                    for (ndx = 0; ndx < session.responses.length; ndx++) {
                        values.push(session.responses[ndx].count);
                        contents.push(session.responses[ndx].content);
                    }
                }
                $scope.myJson = {
                    type: "bar",
                    title: {
                        backgroundColor: "transparent",
                        fontColor: "black",
                        text: ""
                    },
                    "scale-x": {
                        "values": contents,
                    },
                    backgroundColor: "white",
                    series: [{
                        values: values,
                        backgroundColor: "#4DC0CF"
                    }]
                };
                $("#questionStatisticsHistogramModal").modal({
                    show: true,
                    keyboard: false,
                    backdrop: "static"
                });
            };
            $scope.getPercentCorrectByQuestionByStudent = function(question_id, user) {
                if (user.statistics !== undefined && user.statistics !== null) {
                    var hashMap = user.statistics.questionToSessionHashMap;
                    if (Object.keys(hashMap).indexOf(question_id.toString()) >= 0) {
                        return (parseFloat(hashMap[question_id].correct) / parseFloat(hashMap[question_id].total) * 100).toFixed(2).toString() + " %";
                    } else {
                        return "N/A";
                    }
                }
            };
            $scope.getCorrectOutOfPossibleByQuestionByStudent = function(question_id, user) {
                if (user.statistics !== undefined && user.statistics !== null) {
                    var hashMap = user.statistics.questionToSessionHashMap;
                    if (Object.keys(hashMap).indexOf(question_id.toString()) >= 0) {
                        console.log(hashMap[question_id]);
                        return hashMap[question_id].correct + " / " + hashMap[question_id].total;
                    } else {
                        return "N/A";
                    }
                }
            };

            // functions to get data from API
            function getModules() {
                $http.get(API_URL + "/module?token=" + API_TOKEN)
                    .success(function(response) {
                        $scope.modules = response;
                    });
            }
            function getQuestions() {
                $http.get(API_URL + "/question?token=" + API_TOKEN)
                    .success(function(response) {
                        $scope.questions = response;
                    });
            }
            function getAnswers(question_id) {
                $http.get(API_URL + "/answer/getAnswerChoices?token=" + API_TOKEN + "&question_id=" + question_id)
                    .success(function(response) {
                        $scope.questionModal.answers = response;
                    });
            }
            function getQuestionStatistics(question_id) {
                $http.get(API_URL + "/stats/question?token=" + API_TOKEN + "&question_id=" + question_id)
                    .success(function(response) {
                        var sessions = response;
                        for (var ndx = 0, session; ndx < sessions.length; ndx++) {
                            session = sessions[ndx];
                            $http.get(API_URL + "/stats/session?token=" + API_TOKEN + "&id=" + session.session_id)
                                .success(getQuestionsStatisticsSuccessCallback);
                        }
                    });
            }
            function getQuestionsStatisticsSuccessCallback(response) {
                var session = response;
                $scope.questionStatisticsModal.sessions.push(session);
                if ($scope.questionStatisticsModal.totals.length === 0) {
                    for (var i = 0; i < session.responses.length; i++) {
                        $scope.questionStatisticsModal.totals.push(0);
                    }
                }
                for (var j = 0; j < session.responses.length; j++) {
                    $scope.questionStatisticsModal.totals[j] += session.responses[j].count;
                }
                $scope.questionStatisticsModal.totalsTotal = 0;
                for (var k = 0; k < $scope.questionStatisticsModal.totals.length; k++) {
                    $scope.questionStatisticsModal.totalsTotal += $scope.questionStatisticsModal.totals[k];
                }
            }
            function mod(n, m) {
                return ((n % m) + m) % m;
            }
            function User(user) {// user class
                this.gt_username = user.gt_username;
                this.first_name = user.first_name;
                this.last_name = user.last_name;
                this.user_id = user.user_id;
                this.user_type_id = user.user_type_id;
                this.user_type = user.user_type;
                this.email = user.email;
                this.statistics = null;
            }
            function getUsers() {
                $http.get(API_URL + "/user?token=" + API_TOKEN)
                    .success(function(response) {
                        $scope.users = [];
                        for (var ndx = 0; ndx < response.length; ndx++) {
                            $scope.users.push(new User(response[ndx]));
                        }
                        for (var i = 0; i < $scope.users.length; i++) {
                            if ($scope.users[i].user_type.toLowerCase() === "student") {
                                $http.get(API_URL + "/stats/user?token=" + API_TOKEN + "&id=" + $scope.users[i].user_id)
                                    .success(getUserStatisticsSuccessCallback);
                            }
                        }
                    });
            }
            function getUserStatisticsSuccessCallback(response) {
                for (var j = 0; j < $scope.users.length; j++) {
                    if (parseInt($scope.users[j].user_id) === parseInt(response.user_id)) {
                        $scope.users[j].statistics = {
                            user_id: response.user_id,
                            correct: response.correct,
                            total: response.total,
                            sessions: response.responses,
                            questionToSessionHashMap: getQuestionToSessionsHashMap(response.responses),
                            percentCorrect: (parseInt(response.correct) / parseInt(response.total) * 100).toFixed(2)
                        };
                        console.log($scope.users[j]);
                        break;
                    }
                }
            }
            function getQuestionToSessionsHashMap(sessions) {
                var hashMap = {};
                for (var ndx = 0, session; ndx < sessions.length; ndx++) {
                    session = sessions[ndx];
                    if (Object.keys(hashMap).indexOf(session.question_id.toString()) >= 0) {
                        hashMap[session.question_id].correct += session.correct ? 1 : 0;
                        hashMap[session.question_id].total += 1;
                        hashMap[session.question_id].sessions.push(session);
                    } else {
                        hashMap[session.question_id] = {
                            correct: session.correct ? 1 : 0,
                            total: 1,
                            sessions: []
                        };
                        hashMap[session.question_id].sessions.push(session);
                    }
                }
                return hashMap;
            }
            function getUserTypes() {
                $http.get(API_URL + "/user/getUserTypes?token=" + API_TOKEN)
                    .success(function(response) {
                        $scope.userTypes = response;
                    });
            }

            // initialize
            $scope.radioModel = null;
            $scope.tab = 1;
            getModules();
            getQuestions();
            getUsers();
            getUserTypes();

        });

}());