var express = require("express");
var router = express.Router();
var answerDao = require("../dao/answerDao");
var util = require("../util/util");
var config = require("../util/config");

router.get("/getCorrectAnswer", function(request, response) {
    var question_id = request.query.question_id;
    answerDao.getCorrectAnswer(question_id, function(error, rows) {
        if (error) {
            response.status(500).json("Failed to get answer with question id " + question_id);
        } else {
            response.json(rows);
        }
    });
});

router.get("/getAnswerChoices", function(request, response) {
	var question_id = request.query.question_id;
	answerDao.getAnswerChoices(question_id, function(error, rows) {
		if (error) {
			response.status(500).json("Failed to get all answer choices for question id " + question_id);
		} else {
            answers = [];
            for (i = 0; i < rows.length; i++) {
                answers.push(rows[i]);
            }
            util.shuffleArray(answers);
			response.status(200).json(answers);
		}
	});
});

router.post("/addAnswer", function(request, response) {
    var question_id = request.query.question_id;
    var content = request.query.content;
    var is_correct = request.query.is_correct;

    if (!(question_id && content && is_correct)) {
        response.status(500).json("missing parameters");
    } else {
        answerDao.add(question_id, content, is_correct, function(error, rows) {
            if (error) {
                response.status(500).json("Failed to add answer");
            } else {
                response.status(200).json({answer_id: rows.insertId});
            }
        });
    }
});

router.delete("/delete", function (request, response) {
    var answer_id = request.query.answer_id;
    answerDao.deleteAnswer(answer_id, function(error, rows) {
        if (error) {
            response.status(500).json("Failed to delete answer with id: " + answer_id);
        } else {
            if (rows.affectedRows == 0) {
                response.status(400).json("Answer not found for id: " + answer_id);
            } else {
                response.status(200).json("Successfully deleted answer");
            }
        }
    });
});

router.put("/update", function (request, response) {
    var answer_id = request.query.answer_id;
    var field = request.query.field;
    var value = request.query.value;
    answerDao.updateAnswer(answer_id, field, value, function(error, rows) {
        if (error) {
            response.status(500).json("Failed to update answer with id: " + answer_id);
        } else {
            if (rows.affectedRows == 0) {
                response.status(400).json("Answer not found for id: " + answer_id);
            } else {
                response.status(200).json("Successfully updated answer");
            }
	   }
    });
});

router.put("/setCorrect", function(request, response) {
    var correct_answer_id = request.query.answer_id;
    // Get question id of answer
    answerDao.getQuestionId(correct_answer_id, function(error, rows) {
        if (error) {
            response.status(500).json("Failed to retrieve question id for answer id: " + correct_answer_id);
        } else if (rows.length == 0) {
            response.status(400).json("No answer found for id: " + correct_answer_id);
        } else {
            var question_id = rows[0].question_id;
            // Get all answer ids for question
            answerDao.getAnswerChoices(question_id, function(error, rows) {
                if (error) {
                    response.status(500).json("Failed to retrieve answer choices for question id: " + question_id);
                } else if (rows.length == 0) {
                    response.status(400).json("No question found for id: " + question_id);
                } else {
                    var incorrect_answer_ids = []
                    for (i = 0; i < rows.length; i++) {
                        incorrect_answer_ids.push(rows[i].answer_id);
                    }
                    // Initially set all to incorrect
                    answerDao.setIncorrect(incorrect_answer_ids, function(error, rows) {
                        if (error) {
                            response.status(500).json("Failed to set to incorrect: " + incorrect_answer_ids);
                        } else {
                            // Set desired one to correct
                            answerDao.setCorrect(correct_answer_id, function(error, rows) {
                                if (error) {
                                    response.status(500).json("Failed to set to correct: " + correct_answer_id);
                                } else {
                                    response.status(200).json("Successfully set to correct answer: " + correct_answer_id);
                                }
                            });
                        }
                    });
                }
            });
	   }
    });
});

module.exports = router;