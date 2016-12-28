var config = require("../util/config");
var mysqlUtil = require("../util/mysqlUtil");

var add = function(question_id, start_time, callback) {
	var query = "INSERT INTO session (question_id, start_time, end_time) VALUES (?, ?, NULL)"
	mysqlUtil.executeSQL(query, [question_id, start_time], callback);
}

var end = function(session_id, end_time, callback) {
    var query = "UPDATE session SET end_time = ? " +
                "WHERE session_id = ? AND end_time IS NULL"
    mysqlUtil.executeSQL(query, [end_time, session_id], callback);
}

var get = function(session_id, callback) {
	var query = "SELECT * FROM session WHERE session_id = ?";
	mysqlUtil.executeSQL(query, [session_id], callback);
}

var getRecent = function(callback) {
	var query = "SELECT * FROM session ORDER BY end_time DESC LIMIT 1";
	mysqlUtil.executeSQL(query, [], callback);
}

var getSessionId = function(callback) {
    var query = "SELECT MAX(session_id) as session_id from session";
    mysqlUtil.executeSQL(query, [], callback);
}

var getActiveSessions = function(callback) {
  var query = "SELECT s.session_id, "
            + "s.question_id, "
            + "q.name AS question_name, "
            + "q.content AS question_content, "
            + "q.module_id, "
            + "m.name AS module_name, "
            + "a.answer_id, "
            + "a.content AS answer_content "
            + "FROM session s "
            + "JOIN question q "
            + "ON q.question_id = s.question_id "
            + "JOIN answer a "
            + "ON a.question_id = s.question_id "
            + "JOIN module m "
            + "ON m.module_id = q.module_id "
            + "WHERE s.end_time IS null "
            + "ORDER BY s.session_id;";
  mysqlUtil.executeSQL(query, [], callback);
}

var getSessionsByQuestionId = function(question_id, callback) {
  var query = "SELECT * FROM session WHERE question_id = ?";
  mysqlUtil.executeSQL(query, [question_id], callback);
}

module.exports = {
	add : add,
    end : end,
    get : get,
    getRecent : getRecent,
    getSessionId : getSessionId,
    getActiveSessions : getActiveSessions,
    getSessionsByQuestionId : getSessionsByQuestionId
};