// Helpers module

// Dependencies
var 
    crypto      = require('crypto'),
    config      = require('./config'),
    querystring = require('querystring'),
    https       = require('https');


// Module container
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
        for (i=0; i < str_length; i++){

            // Get random charecter from the possibel string variable
            // and append the chrecter to thr final string
            random_str+= possible_charecters.charAt(Math.floor(Math.random() * possible_charecters.length));

        }

        return random_str;

    } else {
        return false;
    }
}

/**
 * Send SMS message via Twilio
 * 
 * @param {string}   phone
 * @param {string}   message
 * @param {function} callabck
 * 
 */
helpers.send_twilio_sms = function(phone, message, callabck) {

    // Validate inputs

    // @TODO he uses 10 which makes no sence in here right?
    phone = typeof(phone) == 'string' && phone.trim().length > 0 
        ? '+' + phone 
        : false;
    
    var message_length = message.trim().length;
    message = typeof(message) == 'string' && message_length > 0 && message_length <= 1600
        ?  message.trim()
        : false;

    if (phone && message) {
        // Configure the request payload for twilio

        var payload = {
            From: config.twilio.from_phone,
            To: phone,
            Body: message
        }

        // Stringify the twilio request and confugure the request detsails
        var string_payload = querystring.stringify(payload);

        // Configure the HTTPS request details
        var request_details = {
            protocol: 'https:',
            hostname: 'api.twilio.com',
            method: 'POST',
            path: '/2010-04-01/Accounts/' + config.twilio.accountsSid + '/Messages.json',
            auth: config.twilio.accountsSid + ':' + config.twilio.authToken,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-length': Buffer.byteLength(string_payload)

            }
        };

        // Instansiate the request object
        var twilio_request = https.request(request_details, function(twilio_response){
            // Grab the ststus of the sent request
            var status = twilio_response.statusCode;

            // Get the response body
            twilio_response.setEncoding('utf8');
            twilio_response.on('data', function (response_body) {
                console.log('Twilio Response Body');
                console.log(JSON.parse(response_body));
            })
            
            // Callback successfully if the ewquest went OK
            if (status == 200 || status == 201) {
                callabck(false);
            } else {
                callabck('Status code return was:' + status)
            }
        });

        // Bind to the error event so it does not get thrown
        // By binding in Node == we make sure errors will not kill the thred (the server run)
        twilio_request.on('error', function(error){

            console.info('internal node request error');
            console.info('error', error);
            callabck(error);
        });

        // Request paylod needs to be added seperately 
        twilio_request.write(string_payload);

        // End the request
        // This is alsow be sending the request and it will start the response/ error scycle
        twilio_request.end(); 


        
        //callabck(true);
    } else {
        callabck('Given parameters where missing or invalid');
    }
}




// Export the module
module.exports = helpers;