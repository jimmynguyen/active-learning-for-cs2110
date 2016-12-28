var express = require("express");
var router = express.Router();
var answerDao = require("../dao/answerDao");
var questionDao = require("../dao/questionDao");
var responseDao = require("../dao/responseDao");
var config = require("../util/config");

router.get("/getQuestions", function(request, response) {
	var user_id = request.query.user_id;

	// get all past responses that user made
	responseDao.getAllForUser(user_id, function(error, rows) {
		if (error) {
			response.status(500).json("Failed to retrieve all user responses");
		} else if (rows.length == 0) {
			response.status(400).json("No responses found for user with id: " + user_id);
		} else {
			var question_ids = []
			for (i = 0; i < rows.length; i++) {
				question_ids.push(rows[i].question_id);
			}

			// get the question, module, and answer_id information to display
			questionDao.getQuestionModuleAnswer(question_ids, function(error, rows) {
				if (error || rows.length == 0) {
					response.status(500).json("Failed to get questions & module info");
				} else {
					qma = rows;

					// get answer choices for all questions needed
					answerDao.getAnswerChoicesMultiple(question_ids, function(error, rows) {
						if (error) {
							reponse.status(500).json("Failed to retrieve answer choices");
						} else {
							answers = rows;

							// assemble json response
							var questions = [];
							for (i = 0; i < qma.length; i++) {
								var q = {};
								q.module = {
									module_id: qma[i].module_id,
									name: qma[i].module_name
								};
								q.question = {
									question_id: qma[i].question_id,
									name: qma[i].name,
									content: qma[i].content,
									explanation: qma[i].explanation,
									correct_answer_id: qma[i].correct_answer_id
								};
								q.answers = [];
								for (j = 0; j < answers.length; j++) {
									if (answers[j].question_id == qma[i].question_id) {
										var a = {
											answer_id: answers[j].answer_id,
											content: answers[j].content
										}
										q.answers.push(a);
									}
								}
								questions.push(q);
							}
							response.status(200).json(questions);
						}
					});
				}
			});
		}
	});
});

module.exports = router;