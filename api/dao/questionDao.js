var config = require("../util/config");
var mysqlUtil = require("../util/mysqlUtil");

var getAll = function(callback) {
	var query = "SELECT * FROM question"
	mysqlUtil.executeSQL(query, [], callback);
}

var getQuestion = function(question_id, callback) {
	var query = "SELECT * FROM question WHERE question_id = ?";
	mysqlUtil.executeSQL(query, [question_id], callback);
}

var getMultiple = function(question_ids, callback) {
	var query = "SELECT * FROM question WHERE question_id IN (?)"
	mysqlUtil.executeSQL(query, [question_ids], callback);
}

var getQuestionModuleAnswer = function(question_ids, callback) {
	var query = "SELECT q.*, m.module_id AS module_id, m.name AS module_name, a.answer_id AS correct_answer_id "
				+ "FROM question q "
				+ "JOIN module m ON m.module_id = q.module_id "
				+ "JOIN answer a ON a.question_id = q.question_id "
				+ "WHERE q.question_id IN (?) AND a.is_correct = 1";
	mysqlUtil.executeSQL(query, [question_ids], callback);
}

var getExplanation = function(question_id, callback) {
	var query = "SELECT name, content, explanation FROM question WHERE question_id = ?";
	mysqlUtil.executeSQL(query, [question_id], callback);
}

var add = function(module_id, name, content, explanation, callback) {
    var query = "INSERT INTO question (module_id, name, content, explanation) VALUES (?, ?, ?, ?)";
    mysqlUtil.executeSQL(query, [module_id, name, content, explanation], callback);
}

var deleteQuestion = function(question_id, callback) {
	var query = "DELETE FROM question WHERE question_id = ?";
	mysqlUtil.executeSQL(query, [question_id], callback);
}

var updateQuestion = function(question_id, field, value, callback) {
	var query = "UPDATE question SET ?? = ? "
				+ "WHERE question_id = ?";
	mysqlUtil.executeSQL(query, [field, value, question_id], callback);
}

module.exports = {
	getAll : getAll,
	getQuestion : getQuestion,
	getMultiple : getMultiple,
	getQuestionModuleAnswer : getQuestionModuleAnswer,
	getExplanation : getExplanation,
	add : add,
	deleteQuestion : deleteQuestion,
	updateQuestion : updateQuestion
};