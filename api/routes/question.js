var express = require("express");
var router = express.Router();
var questionDao = require("../dao/questionDao");
var config = require("../util/config");

router.get("/", function(request, response) {
    questionDao.getAll(function(error, rows) {
        if (error) {
            response.status(500).json("Failed to retrieve all questions");
        } else {
            response.status(200).json(rows);
        }
    });
});

router.get("/getQuestion", function(request, response) {
    var question_id = request.query.question_id;
    questionDao.getQuestion(question_id, function(error, rows) {
        if (error) {
            response.status(500).json("Failed to get question with id " + question_id);
        } else {
            response.status(200).json(rows);
        }
    });
});

router.get("/getQuestionMultiple", function(request, response) {
    var question_ids = request.query.question_id;
    questionDao.getMultiple(question_ids, function(error, rows) {
        if (error) {
            response.status(500).json("Failed to retrieve questions");
        } else {
            response.status(200).json(rows);
        }
    });
});

router.get("/getExplanation", function(request, response) {
    var question_id = request.query.question_id;
    questionDao.getExplanation(question_id, function(error, rows) {
        if (error) {
            response.status(500).json("Failed to get explanation for question id " + question_id);
        } else {
            response.status(200).json(rows);
        }
    });
});

router.post("/addQuestion", function(request, response) {
    var module_id = request.query.module_id;
    var name = request.query.name;
    var content = request.query.content;
    var explanation = request.query.explanation;
    if (!(module_id && name && content && explanation)) {
        response.status(500).json("missing parameters");
    } else {
        questionDao.add(module_id, name, content, explanation, function(error, rows) {
            if (error) {
                response.status(500).json("Failed to add question");
            } else {
                response.status(200).json({message: "Successfully added question", question_id: rows.insertId});
            }
        });
    }
});

router.delete("/delete", function(request, response) {
    var question_id = request.query.question_id;
    questionDao.deleteQuestion(question_id, function(error, rows) {
        if (error) {
            response.status(500).json("Failed to delete question with id: " + question_id);
        } else {
            if (rows.affectedRows == 0) {
                response.status(400).json("Question not found for id: " + question_id);
            } else {
                response.status(200).json("Successfully deleted question");
            }
        }
    });
});

router.put("/update", function(request, response) {
    var question_id = request.query.question_id;
    var field = request.query.field;
    var value = request.query.value;
    questionDao.updateQuestion(question_id, field, value, function(error, rows) {
        if (error) {
            response.status(500).json("Failed to update question with id: " + question_id);
        } else {
            if (rows.affectedRows == 0) {
                response.status(400).json("Question not found for id: " + question_id);
            } else {
                response.status(200).json("Successfully updated question");
            }
        }
    });
});

module.exports = router;