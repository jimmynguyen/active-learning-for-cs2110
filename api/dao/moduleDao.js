var config = require("../util/config");
var mysqlUtil = require("../util/mysqlUtil");

var getAll = function(callback) {
    var query = "SELECT * FROM module"
    mysqlUtil.executeSQL(query, [], callback);
}

var getModule = function(module_id, callback) {
    var query = "SELECT * FROM module WHERE module_id = ?";
    mysqlUtil.executeSQL(query, [module_id], callback);
}

module.exports = {
    getAll : getAll,
    getModule : getModule
};