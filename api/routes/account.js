var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var userDao = require("../dao/userDao");
var pwUtil = require("../util/passwordUtil");
var config = require("../util/config");

// register an account
router.post("/create", function(request, response) {
	var user_type_id = 3;
	var first_name = request.query.first_name;
	var last_name = request.query.last_name;
	var gt_username = request.query.gt_username;
	var email = request.query.email;
	var password = request.query.password;

	if (password) {
		pwUtil.cryptPassword(password, function(error, hash) {
			if (error) {
				response.status(500).json("Error with password encryption");
			} else {
				if (!(first_name && last_name && gt_username && email)) {
					response.status(500).json("missing parameters");
				} else if (!email.includes("gatech.edu")) {
					response.status(400).json("email is not a gatech email");
				} else {
					userDao.add(user_type_id, first_name, last_name, gt_username, email, hash, function(error, rows) {
						if (error) {
							response.status(500).json("Failed to create user account");
						} else if (!rows) {
							response.status(400).json("User with GT username or email already registered");
						} else {
							response.status(200).json("Successfully created account");
						}
					});
				}
			}
		});
	}
});

// authenticate a user and create token
router.post("/authenticate", function(request, response) {
	var gt_username = request.query.gt_username;
	var password = request.query.password;

	if (gt_username && password) {
		// check if user is in database
		userDao.findOne(gt_username, function(error, rows) {
			if (error) {
				response.status(500).json({
					success: false,
					message: "Authentication failed"
				});
			} else if (!rows) {
				response.status(404).json({
					success: false,
					message: "No user found for username " + gt_username
				});
			} else {
				// verify password with encrypted password
				pwUtil.comparePassword(password, rows[0].password, function(error, isPasswordMatch) {
					if (error) {
						response.status(500).json({
							success: false,
							message: "Error with bcrypt compare"
						});
					} else {
						if (isPasswordMatch) {
							var token = jwt.sign(rows[0], config.SECRET, {
								expiresIn: "2h"
							});

							// check if user is admin
							var isAdmin = false;
							if (rows[0].user_type_id == 1 || rows[0].user_type_id == 2) {
								isAdmin = true;
							}

							response.status(200).json({
								success: true,
							        user: {
								    user_id: rows[0].user_id,
								    first_name: rows[0].first_name,
								    last_name: rows[0].last_name
								},
								admin: isAdmin,
								token: token
							});
						} else {
							response.status(400).json({
								success: false,
								message: "Incorrect password for user " + gt_username
							});
						}
					}
				});
			}
		});
	}
});

module.exports = router;
