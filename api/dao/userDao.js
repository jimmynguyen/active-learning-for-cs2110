var config = require("../util/config");
var mysqlUtil = require("../util/mysqlUtil");

var getAll = function(callback) {
	var query = "SELECT u.*, ut.type AS user_type FROM user u JOIN user_type ut ON u.user_type_id = ut.user_type_id";
	mysqlUtil.executeSQL(query, [], callback);
}

var getAdmins = function(callback) {
	var query = "SELECT * FROM user WHERE user_type_id = 1 OR user_type_id = 2";
	mysqlUtil.executeSQL(query, [], callback);
}

var getUsers = function(callback) {
	var query = "SELECT * FROM user WHERE user_type_id = 3";
	mysqlUtil.executeSQL(query, [], callback);
}

var getUserTypes = function(callback) {
	var query = "SELECT * FROM user_type";
	mysqlUtil.executeSQL(query, [], callback);
}

var add = function(user_type_id, first_name, last_name, gt_username, email, password, callback) {
	var query = "INSERT INTO user (user_type_id, first_name, last_name, gt_username, email, password) VALUES (?, ?, ?, ?, ?, ?)"
	findAny(null, gt_username, email, function(error, rows) {
		if (!rows) {
			mysqlUtil.executeSQL(query, [user_type_id, first_name, last_name, gt_username, email, password], callback);
		} else {
			callback(error, null);
		}
	});
}

var remove = function(user_id, callback) {
	var query = "DELETE FROM user WHERE user_id = ?";
	findAny(user_id, null, null, function(error, rows) {
		if (!rows) {
			callback(error, null);
		} else {
			mysqlUtil.executeSQL(query, [user_id], callback);
		}
	});
}

var makeAdmin = function(user_ids, callback) {
	var query = "UPDATE user SET user_type_id = 2 "
				+ "WHERE user_id IN (?) AND user_type_id = 3";

	findAll(user_ids, function(error, rows) {
		if (error || !rows) {
			callback(error, null);
		} else {
			mysqlUtil.executeSQL(query, [user_ids], callback);
		}
	});
}

// *************************************
// Util for checking if user in database
// *************************************
var findOne = function(gt_username, callback) {
	var query = "SELECT * FROM user WHERE gt_username = ?";
	mysqlUtil.executeSQL(query, [gt_username], function(error, rows) {
		if (error) {
			callback(error, null);
		} else if (rows.length === 1) {
			callback(null, rows);
		} else {
			callback(error, null);
		}
	});
}

var findAll = function(user_ids, callback) {
	var query = "SELECT * FROM user WHERE user_id IN (?) AND user_type_id = 3";
	mysqlUtil.executeSQL(query, [user_ids], function(error, rows) {
		if (error) {
			callback(error, null);
		} else if (rows.length != user_ids.length) {
			callback(error, null);
		} else {
			callback(null, rows);
		}
	});
}

var findAny = function(user_id, gt_username, email, callback) {
	var query = "SELECT * FROM user WHERE user_id = ? OR gt_username = ? OR email = ?";
	mysqlUtil.executeSQL(query, [user_id, gt_username, email], function(error, rows) {
		if (error) {
			callback(error, null);
		} else if (rows.length > 0) {
			callback(null, rows);
		} else {
			callback(error, null);
		}
	});
}

var findAdmin = function(user_id, gt_username, email, callback) {
	var query = "SELECT * FROM user WHERE (user_id = ? OR gt_username = ? OR email = ?) AND (user_type_id = 1 OR user_type_id = 2)";
	mysqlUtil.executeSQL(query, [user_id, gt_username, email], function(error, rows) {
		if (error) {
			callback(error, null);
		} else if (rows.length > 0) {
			callback(null, rows);
		} else {
			callback(error, null);
		}
	});
}

module.exports = {
	getAll : getAll,
	getAdmins : getAdmins,
	getUsers : getUsers,
	getUserTypes: getUserTypes,
	add : add,
	remove : remove,
	makeAdmin : makeAdmin,
	findOne : findOne
};