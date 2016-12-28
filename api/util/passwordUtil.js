var bcrypt = require('bcryptjs');

// encrypt password with salt and hash
var cryptPassword = function(password, callback) {
    bcrypt.genSalt(10, function(error, salt) {
        if (error) {
            return callback(error);
        }
        bcrypt.hash(password, salt, function(error, hash) {
            return callback(error, hash);
        });
    });
};

var comparePassword = function(password, encrypted, callback) {
    bcrypt.compare(password, encrypted, function(error, isPasswordMatch) {
        if (error) {
            return callback(error);
        }
        return callback(null, isPasswordMatch);
    });
};

module.exports = {
    cryptPassword : cryptPassword,
    comparePassword : comparePassword
};