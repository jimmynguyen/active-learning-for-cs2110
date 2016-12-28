var express = require("express");
var router = express.Router();
var sessionDao = require("../dao/sessionDao");
var questionDao = require("../dao/questionDao");
var util = require("../util/util");
var config = require("../util/config");

router.post("/create", function(request, response) {
    var question_id = request.query.question_id;
    var start_time = new Date();

    if (!(question_id && start_time)) {
        response.status(500).json("missing parameters");
    } else {
        // create session in database
        sessionDao.add(question_id, start_time, function(error, rows) {
            if (error) {
                response.status(500).json("Failed to create session");
            } else {
                // grab newly created session to return
                sessionDao.getSessionId(function(error, rows) {
                    if (error) {
                        response.status(500).json("Failed to retrieve session id");
                    } else {
                        response.status(200).json(rows[0]);
                    }
                });
            }
        });
    }
});

router.put("/end", function(request, response) {
    var session_id = request.query.session_id;
    var end_time = new Date();

    if (!(session_id && end_time)) {
        response.status(500).json("missing parameters");
    } else {
        sessionDao.end(session_id, end_time, function(error, rows) {
            if (error) {
                response.status(500).json("Failed to end session");
            } else if (rows.changedRows == 0) {
                response.status(404).json("Session not found for id " + session_id + " or session already over");
            } else {
                response.status(200).json("Successfully ended session");
            }
        });
    }
});

router.get("/getSessionId", function(request, response) {
    sessionDao.getSessionId(function(error, rows) {
        if (error) {
            response.status(500).json("Failed to retrieve session id");
        } else {
            response.status(200).json(rows);
        }
    });
});

router.get("/getActiveSessionInfo", function(request, response) {
    sessionDao.getActiveSessions(function(error, rows) {
        if (error) {
            response.status(500).json(error);
        } else {
            var sessions = [];
            var currentSessionId = -1;
            var answers = [];
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].session_id != currentSessionId) {
                    var question = {};
                    var module = {};
                    // empty out answers array
                    answers = [];
                    var session = {session_id : rows[i].session_id, question : question, answers : answers};

                    sessions.push(session);
                    question.question_id = rows[i].question_id;
                    question.name = rows[i].question_name;
                    question.content = rows[i].question_content;
                    question.module = module;
                    module.module_id = rows[i].module_id;
                    module.name = rows[i].module_name;
                    currentSessionId = rows[i].session_id;
                }
                var answer = {answer_id : rows[i].answer_id, content : rows[i].answer_content};
                answers.push(answer);
            }
            util.shuffleArray(answers);

            response.status(200).json(sessions);
        }
    });
});

module.exports = router;