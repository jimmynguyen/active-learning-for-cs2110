var express = require("express");
var router = express.Router();
var responseDao = require("../dao/responseDao");
var config = require("../util/config");

router.post("/addResponse", function(request, response) {
	var user_id = request.query.user_id;
	var session_id = request.query.session_id;
	var question_id = request.query.question_id;
	var answer_id = request.query.answer_id;

	if (!(user_id && session_id && question_id && answer_id)) {
		response.status(500).json("missing parameters");
	} else {
		var sessionEndStatus = responseDao.getSessionEndStatus(session_id, function(error, rows) {
			if (error) {
				response.status(500).json("Failed add response");
			//check if end_time is null (session not ended)
			} else if (!rows[0].end_time) {
				responseDao.add(user_id, session_id, question_id, answer_id, function(error, rows) {
					if (error) {
						response.status(500).json("Failed to add response");
					} else {
						response.status(200).json("Successfully added response");
					}
				});
			} else {
				response.status(500).json("Failed to add response as session has ended");
			}
		});
	}
});

module.exports = router;