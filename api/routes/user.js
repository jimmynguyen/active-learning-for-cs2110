var express = require("express");
var router = express.Router();
var userDao = require("../dao/userDao");
var pwUtil = require("../util/passwordUtil");
var config = require("../util/config");

// get all users (admins + students)
router.get("/", function(request, response) {
	userDao.getAll(function(error, rows) {
		if (error) {
			response.status(500).json("Failed to retrieve all users");
		} else {
			response.json(rows);
		}
	});
});

// get just admins
router.get("/getAdmins", function(request, response) {
	userDao.getAdmins(function(error, rows) {
		if (error) {
			response.status(500).json("Failed to retrieve admins");
		} else if (rows.length == 0) {
			response.status(400).json("No admins found");
		} else {
			response.status(200).json(rows);
		}
	});
});

// get just students
router.get("/getUsers", function(request, response) {
	userDao.getUsers(function(error, rows) {
		if (error) {
			response.status(500).json("Failed to retrieve users");
		} else if (rows.length == 0) {
			response.status(400).json("No users found");
		} else {
			response.status(200).json(rows);
		}
	});
});

router.get("/getUserTypes", function(request, response) {
	userDao.getUserTypes(function(error, rows) {
		if (error) {
			response.status(500).json("Failed to retrieve user types");
		} else if (rows.length == 0) {
			response.status(400).json("No user types found");
		} else {
			response.status(200).json(rows);
		}
	});
});

router.post("/addUser", function(request, response) {
	var user_type_id = request.query.user_type_id;
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
				if (!(user_type_id && first_name && last_name && gt_username && email)) {
					response.status(500).json("missing parameters");
				} else if (!email.includes("gatech.edu")) {
					response.status(400).json("email is not a gatech email");
				} else {
					userDao.add(user_type_id, first_name, last_name, gt_username, email, hash, function(error, rows) {
						if (error) {
							response.status(500).json("Failed to add user");
						} else if (!rows) {
							response.status(400).json("User with GT username or email already registered");
						} else {
							response.status(200).json("Successfully added user");
						}
					});
				}
			}
		});
	}
});

router.delete("/removeUser", function(request, response) {
	var user_id = request.query.user_id;

	userDao.remove(user_id, function(error, rows) {
		if (error) {
			response.status(500).json("Failed to remove user with id " + user_id);
		} else if (!rows) {
			response.status(404).json("User not found id:" + user_id);
		} else {
			response.status(200).json("Successfully removed user");
		}
	});
});

router.put("/makeAdmin", function(request, response) {
	var ids = request.query.user_id;
	var user_ids;
	if (typeof ids === "string") {
		user_ids = [ids];
	} else {
		user_ids = ids;
	}

	userDao.makeAdmin(user_ids, function(error, rows) {
		if (error) {
			reponse.status(500).json("Failed to make admin with user ids: " + user_ids);
		} else if (!rows) {
			response.status(400).json("Failed: a user id was not found or a user is already admin");
		} else {
			response.status(200).json("Sucessfully made user(s) admin");
		}
	});
});

module.exports = router;