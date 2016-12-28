var express = require("express");
var router = express.Router();
var moduleDao = require("../dao/moduleDao");
var config = require("../util/config");

// list of all modules
router.get("/", function(request, response) {
    moduleDao.getAll(function(error, rows) {
        if (error) {
            response.status(500).json("Failed to retrieve all modules");
        } else {
            response.status(200).json(rows);
        }
    });
});

// specific module by id
router.get("/getModule", function(request, response) {
    var module_id = request.query.module_id;
    moduleDao.getQuestion(module_id, function(error, rows) {
        if (error) {
            response.status(500).json("Failed to get module with id " + module_id);
        } else {
            response.status(200).json(rows);
        }
    });
});

module.exports = router;