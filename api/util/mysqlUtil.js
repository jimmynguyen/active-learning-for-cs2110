var mysql = require("mysql");
var config = require("./config");

var pool = mysql.createPool({
	host 			 : config.HOST,
	user 			 : config.USER,
	password 		 : config.PASSWORD,
	database 		 : config.DATABASE,
	connection_limit : config.CONNECTION_LIMIT,
	debug 			 : config.DEBUG
});

var executeSQL = function(query, params, callback) {
	pool.getConnection(function(error, connection) {
		if (error) {
			console.log("Failed to connect to database");
			callback(error, null);
		}

		connection.query(query, params, function(error, rows) {
			if (error) {
				callback(error, null);
			} else {
				callback(null, rows);
			}
			connection.release();
		});
	});
};

module.exports = {
	executeSQL : executeSQL
};