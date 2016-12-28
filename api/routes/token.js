var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var config = require("../util/config");

// route to authenticate a user
// route middleware to verify a token
router.use(function(request, response, next) {
	// check header or url parameters or post parameters for token
	var token = request.body.token || request.query.token || request.headers['x-access-token'];

	// decode token
	if (token) {
		jwt.verify(token, config.SECRET, function(error, decoded) {            
			if (error) {
				return response.status(400).json("Failed to authenticate token");        
			} else {
				// if everything is good, save to request for use in other routes
				request.decoded = decoded;
				next();
			}
		});
	} else {
		return response.status(403).json("No token provided"); 
	}
});

module.exports = router;