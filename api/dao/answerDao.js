var config = require("../util/config");
var mysqlUtil = require("../util/mysqlUtil");

var getCorrectAnswer = function(question_id, callback) {
	var query = "SELECT * FROM answer WHERE question_id = ? AND is_correct = 1";
	mysqlUtil.executeSQL(query, [question_id], callback);
}

var getAnswerChoices = function(question_id, callback) {
	var query = "SELECT * FROM answer WHERE question_id = ?";
	mysqlUtil.executeSQL(query, [question_id], callback);
}

var getAnswerChoicesMultiple = function(question_ids, callback) {
	var query = "SELECT * FROM answer WHERE question_id IN (?)";
	mysqlUtil.executeSQL(query, [question_ids], callback);
}

var add = function(question_id, content, is_correct, callback) {
    var query = "INSERT INTO answer (question_id, content, is_correct) VALUES (?, ?, ?)";
    mysqlUtil.executeSQL(query, [question_id, content, is_correct], callback);
}

var deleteAnswer = function(answer_id, callback) {
    var query = "DELETE FROM answer WHERE answer_id = ?";
    mysqlUtil.executeSQL(query, [answer_id], callback);
}

var updateAnswer = function(answer_id, field, value, callback) {
	var query = "UPDATE answer SET ?? = ? "
				+ "WHERE answer_id = ?";
	mysqlUtil.executeSQL(query, [field, value, answer_id], callback);
}

var setCorrect = function(answer_id, callback) {
	var query = "UPDATE answer SET is_correct = 1 "
				+ "WHERE answer_id = ?";
	mysqlUtil.executeSQL(query, [answer_id], callback);
}

var setIncorrect = function(answer_ids, callback) {
	var query = "UPDATE answer SET is_correct = 0 "
				+ "WHERE answer_id IN (?)";
	mysqlUtil.executeSQL(query, [answer_ids], callback);
}

var getQuestionId = function(answer_id, callback) {
	var query = "SELECT question_id FROM answer WHERE answer_id = ?";
	mysqlUtil.executeSQL(query, [answer_id], callback);
}

module.exports = {
	getCorrectAnswer : getCorrectAnswer,
	getAnswerChoices : getAnswerChoices,
	getAnswerChoicesMultiple : getAnswerChoicesMultiple,
    add : add,
    setCorrect : setCorrect,
    setIncorrect : setIncorrect,
    getQuestionId : getQuestionId,
    deleteAnswer: deleteAnswer,
    updateAnswer: updateAnswer,
};