var config = {
	PORT : 3000,

	// Token
	SECRET : "activelearning",

	// Database
	HOST			 : "localhost",
	USER			 : "root",
	PASSWORD		 : "",
	DATABASE 		 : "cs2110_active_learning",
	CONNECTION_LIMIT : 100,
	DEBUG 			 : true,

	// Error Codes
	ERROR_DATABASE 		  : 0,
	ERROR_DATABASE_SELECT : 1,
	ERROR_DATABASE_INSERT : 2,
	ERROR_DATABASE_DELETE : 3,

	// Errors
	outputError : function(error, response) {
		console.log(error);
		switch (error.code) {
			case config.ERROR_DATABASE:
				response.status(500).json(error.message);
				break;
			case config.ERROR_DATABASE_SELECT:
				response.status(500).json(error.message);
				break;
			case config.ERROR_DATABASE_INSERT:
				response.status(500).json(error.message);
				break;
			case config.ERROR_DATABASE_DELETE:
				response.status(500).json(error.message);
				break;
			default:
				response.status(500).json(error);
				break;
		}
	}
};

module.exports = config;