// Helpers module

// Dependencies

var crypto = require('crypto');
var config = require('./config');


// Module continer
var helpers = {};

/**
 * Hash the passowrd
 * 
 * @param {String} string 
 * @returns hashed_string
 */
helpers.hash = function (str) {
    if (typeof str == 'string' && str.length > 0) {

        var hash = crypto
            .createHmac('sha256', config.hashingSecret)
            .update(str)
            .digest('hex');

        return hash;

    } else {
        return false;
    }
};

/**
 * Parse a JSON string to an object in all cases without throwing
 * @param {JSON} json_string 
 */
helpers.paresJsonToObject = function (json_string) {

    try {
        return JSON.parse(json_string);
    } catch(e){

        return {};
    }
}

// Export the module
module.exports = helpers;