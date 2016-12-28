var express = require("express");
var router = express.Router();
var answerDao = require("../dao/answerDao");
var questionDao = require("../dao/questionDao");
var responseDao = require("../dao/responseDao");
var sessionDao = require("../dao/sessionDao");
var config = require("../util/config");

// past statistics for a user (all questions answered)
router.get("/user", function(request, response) {
	var user_id = request.query.id;

	// get all user responses
	responseDao.getAllForUser(user_id, function(error, rows) {
		if (error) {
			response.status(500).json("Failed to get all responses for user with id: " + user_id);
		} else if (rows.length == 0) {
			response.status(400).json("No responses found for user with id: " + user_id);
		} else {
			var responses = [];
			var questions = [];
			for (i = 0; i < rows.length; i++) {
				var r = {
					session_id: rows[i].session_id,
					module_id: null,
					question_id: rows[i].question_id,
					question_name: null,
					question_content: null,
					question_explanation: null,
					correct: false,
					user_answer_id: rows[i].answer_id,
					user_answer_content: null,
					correct_answer_id: null,
					correct_answer_content: null
				};
				responses.push(r);
				questions.push(rows[i].question_id);
			}

			// get answer information (id & content) for user's answers and correct answers
			answerDao.getAnswerChoicesMultiple(questions, function(error, rows) {
				if (error) {
					response.status(500).json("Failed to retrieve answer choices");
				} else {
					var correct_count = 0;
					for (i = 0; i < responses.length; i++) {
						for (j = 0; j < rows.length; j++) {
							if (responses[i].question_id == rows[j].question_id) {
								if (rows[j].is_correct == 1) {
									responses[i].correct_answer_id = rows[j].answer_id;
									responses[i].correct_answer_content = rows[j].content;
									if (responses[i].user_answer_id == rows[j].answer_id) {
										responses[i].correct = true;
										responses[i].user_answer_content = rows[j].content;
										correct_count++;
									}
								} else {
									if (responses[i].user_answer_id == rows[j].answer_id) {
										responses[i].user_answer_content = rows[j].content;
									}
								}
							}
						}
					}
				}

				// get question information for questions answered
				questionDao.getMultiple(questions, function(error, rows) {
					if (error) {
						response.status(500).json("Failed to retrieve question names and content");
					} else {
						for (i = 0; i < responses.length; i++) {
							for (j = 0; j < rows.length; j++) {
								if (responses[i].question_id == rows[j].question_id) {
									responses[i].module_id = rows[j].module_id;
									responses[i].question_name = rows[j].name;
									responses[i].question_content = rows[j].content;
									responses[i].question_explanation = rows[j].explanation;
								}
							}
						}

						var res = {
							user_id: user_id,
							correct: correct_count,
							total: responses.length,
							responses: responses
						}
						response.status(200).json(res);
					}
				});
			});
		}
	});
});

// past statistics for a user (specific question)
router.get("/userSession", function(request, response) {
	var user_id = request.query.user_id;
	var session_id = request.query.session_id;

	responseDao.getUserSession(user_id, session_id, function(error, rows) {
		if (error) {
			response.status(500).json("Failed to retrieve stats");
		} else if (rows.length == 0) {
			response.status(400).json("No response found for session_id: " + session_id + " and user_id: " + user_id);
		} else {
			var question_id = rows[0].question_id;
			var answer_id = rows[0].answer_id;

			// grab all answer choices to get information for user's and correct answers
			answerDao.getAnswerChoices(question_id, function(error, rows) {
				if (error || rows.length == 0) {
					response.status(500).json("Failed to retrieve answer choices for question id: " + question_id);
				} else {
					var user_answer_content;
					var correct_answer_id;
					var correct_answer_content;
					var is_correct = false;

					for (i = 0; i < rows.length; i++) {
						if (rows[i].is_correct == 1) {
							correct_answer_id = rows[i].answer_id;
							correct_answer_content = rows[i].content;
						}
						if (rows[i].answer_id == answer_id) {
							user_answer_content = rows[i].content;
						}
					}

					if (answer_id == correct_answer_id) {
						is_correct = true;
					}

					// get question information
					questionDao.getQuestion(question_id, function(error, rows) {
						if (error) {
							response.status(500).json("Failed to retrieve question with id: " + quesiton_id);
						} else {
							var module_id = rows[0].moudle_id;
							var question_name = rows[0].name;
							var question_content = rows[0].content;
							var question_explanation = rows[0].explanation;

							// assemble json response with acquired information
							var res = {
								user_id: user_id,
								session_id: session_id,
								module_id: module_id,
								question_id: question_id,
								question_name: question_name,
								question_content: question_content,
								question_explanation: question_explanation,
								correct: is_correct,
								user_answer_id: answer_id,
								user_answer_content: user_answer_content,
								correct_answer_id: correct_answer_id,
								correct_answer_content: correct_answer_content
							}
							response.status(200).json(res);
						}
					});
				}
			});
		}
	});
});

// statistics for a specific session (all students' responses)
router.get("/session", function(request, response) {
	var session_id = request.query.id;

	// first get question_id of session
	sessionDao.get(session_id, function(error, rows) {
		if (error) {
			response.status(500).json("Failed to retrieve stats for session with id: " + session_id);
		} else if (rows.length == 0) {
			response.status(400).json("No session with id: " + session_id);
		} else {
			var question_id = rows[0].question_id;

			// second get answer choices for question
			answerDao.getAnswerChoices(question_id, function(error, rows) {
				if (error || rows.length == 0) {
					response.status(500).json("Failed to retrieve answers for question id: " + question_id);
				} else {
					var options = [];
					for (i = 0; i < rows.length; i++) {
						var option = {
							answer_id: rows[i].answer_id,
							content: rows[i].content,
							is_correct: rows[i].is_correct,
							count: 0
						};
						options.push(option);
					}

					// third get all responses for session
					responseDao.getAllForSession(session_id, function(error, rows) {
						if (error) {
							response.status(500).json("Failed to retreive responses for session id: " + session_id);
						} else if (rows.length == 0) {
							response.status(400).json("No responses for session id: " + session_id);
						} else {
							// count responses by answer choice
							var total_count = 0;
							for (i = 0; i < rows.length; i++) {
								var answer_id = rows[i].answer_id;
								for (j = 0; j < options.length; j++) {
									if (options[j].answer_id == answer_id) {
										options[j].count++;
										total_count++;
									}
								}
							}

							var res = {
								question_id: question_id,
								total_count: total_count,
								responses: options
							};
							response.status(200).json(res);
						}
					});
				}
			});
		}
	});
});

// statistics for most recent session (all students' responses)
router.get("/recentSession", function(request, response) {
	sessionDao.getRecent(function(error, rows) {
		if (error) {
			response.status(500).json("Failed to retrieve stats for recent session");
		} else {
			var session_id = rows[0].session_id;
			var question_id = rows[0].question_id;

			answerDao.getAnswerChoices(question_id, function(error, rows) {
				if (error || rows.length == 0) {
					response.status(500).json("Failed to retrieve answers for question id: " + question_id);
				} else {
					var options = [];
					for (i = 0; i < rows.length; i++) {
						var option = {
							answer_id: rows[i].answer_id,
							content: rows[i].content,
							is_correct: rows[i].is_correct,
							count: 0
						};
						options.push(option);
					}

					responseDao.getAllForSession(session_id, function(error, rows) {
						if (error) {
							response.status(500).json("Failed to retreive responses for session id: " + session_id);
						} else if (rows.length == 0) {
							response.status(400).json("No responses for session id: " + session_id);
						} else {
							var total_count = 0;
							for (i = 0; i < rows.length; i++) {
								var answer_id = rows[i].answer_id;
								for (j = 0; j < options.length; j++) {
									if (options[j].answer_id == answer_id) {
										options[j].count++;
										total_count++;
									}
								}
							}

							var res = {
								question_id: question_id,
								total_count: total_count,
								responses: options
							};
							response.status(200).json(res);
						}
					});
				}
			});
		}
	});
});

router.get("/question", function(request, response) {
	var question_id = request.query.question_id;
	sessionDao.getSessionsByQuestionId(question_id, function(error, rows) {
		if (error) {
			response.status(500).json("Failed to retrieve stats for sessions with question id: " + question_id);
		} else if (rows.length == 0) {
			response.status(400).json("No sessions with question id: " + question_id);
		} else {
			response.status(200).json(rows);
		}
	});
});

module.exports = router;