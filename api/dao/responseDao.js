var config = require("../util/config");
var mysqlUtil = require("../util/mysqlUtil");

var add = function(user_id, session_id, question_id, answer_id, callback) {
	var query = "INSERT INTO response (user_id, session_id, question_id, answer_id) VALUES (?, ?, ?, ?)"
	mysqlUtil.executeSQL(query, [user_id, session_id, question_id, answer_id], callback);
}

var getAllForUser = function(user_id, callback) {
	var query = "SELECT * FROM response WHERE user_id = ?";
	mysqlUtil.executeSQL(query, [user_id], callback);
}

var getAllForSession = function(session_id, callback) {
	var query = "SELECT * FROM response WHERE session_id = ?";
	mysqlUtil.executeSQL(query, [session_id], callback);
}

var getUserSession = function(user_id, session_id, callback) {
	var query = "SELECT * FROM response WHERE user_id = ? AND session_id = ?";
	mysqlUtil.executeSQL(query, [user_id, session_id], callback);
}

var getSessionEndStatus = function(session_id, callback) {
    var query = "SELECT end_time FROM session WHERE session_id = ?";
    mysqlUtil.executeSQL(query, [session_id], callback);
}

module.exports = {
	add : add,
	getAllForUser : getAllForUser,
	getAllForSession : getAllForSession,
	getUserSession : getUserSession,
    getSessionEndStatus : getSessionEndStatus
};