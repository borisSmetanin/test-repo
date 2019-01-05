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
    } catch(e) {

        return {};
    }
}

/**
 * Creates random string
 * 
 * @param {int} length
 * @returns {string}
 */
helpers.create_random_string = function(str_length) {
    str_length = typeof(str_length) == 'number' && str_length > 0 
        ? str_length
        : false;

    if (str_length) {

        var 
            // Define all the possibel charecters that caould co into a string
            possible_charecters = 'abcdefghijklmnopqrstuvwxyz1234567890',
            // Define the final randomm strig output as empty string
            random_str = '';

        // Loop to cresate a random string
        for (i=0; i<= str_length; i++){

            // Get random charecter from the possibel string variable
            // and append the chrecter to thr final string
            random_str+= possible_charecters.charAt(Math.floor(Math.random() * possible_charecters.length));

        }

        return random_str;

    } else {
        return false;
    }
}

// Export the module
module.exports = helpers;