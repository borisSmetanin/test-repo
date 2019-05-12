// Helpers module

// Dependencies
var 
    crypto      = require('crypto'),
    config      = require('./config'),
    querystring = require('querystring'),
    https       = require('https'),
    path        = require('path'),
    fs          = require('fs');


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

/**
 * Helper function to get string content out of the template
 */
helpers.get_template = (template_name, data, callback) => {

    template_name = typeof(template_name) == 'string' && template_name.length > 0 
        ? template_name 
        : false;
    
    // Sanity check the data object
    data = typeof(data) == 'object' && data !== null
        ? data
        : {};
    
    if (template_name) {

        let templates_dir = path.join(__dirname, '/../templates');

        fs.readFile(`${templates_dir}/${template_name}.html`, 'utf8', (err, template_string) => {

            if ( ! err && template_string && template_string.length > 0) {

                let final_string = helpers.interpolate(template_string, data);
                callback(false, final_string);
            } else {
        
                callback('Could not read the HTML file', err);
            }
        });
    } else {
        callback('Template name is invalid');
    }
}

// Add the universal header and footer to a string and pass the provided data object to the header and footer
helpers.add_universal_templates = (str, data, callback) => {

    // Sanity check
    str = typeof(str) == 'string' && str.length > 0 
        ? str 
        : '';

    data = typeof(data) == 'object' && data !== null
        ? data
        : {};

    helpers.get_template('_header', data, (err, header_string) => {
        if ( ! err && header_string) {

            // Get the footer
            helpers.get_template('_footer', data, (err, footer_string) => {

                if ( ! err && footer_string) {


                    let full_string = header_string + str + footer_string;
                    callback(false, full_string);
                } else {
                    callback('Could not get the footer');
                }
            });
        } else {
            callback('Could not find the header template');
        }
    });
}

// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = (str, data) => {
    // Sanity check
    str = typeof(str) == 'string' && str.length > 0 
        ? str 
        : '';

    data = typeof(data) == 'object' && data !== null
        ? data
        : {};

    // Add the template globals to the data object, prepending their key name with global

    for (let key_name in config.template_globals) {
        if (config.template_globals.hasOwnProperty(key_name)) {

            data[`global.${key_name}`] = config.template_globals[key_name];
        }
    }
    // For each ky in the data object, insert its value to the string in the corresponding placeholder
    for (let key in data) {
        if (data.hasOwnProperty(key) && typeof(data[key]) == 'string') {

            let 
                find = `{${key}}`,
                replace = data[key];

            str = str.replace(find, replace);
        }
    }

    return str;
}


// Get public assets
helpers.get_static_assets = (file_name, callabck) => {

    file_name = typeof(file_name) == 'string' && file_name.length > 0 
        ? file_name 
        : false;

    if (file_name) {

        let public_dir = path.join(__dirname, '/../public');

        fs.readFile(`${public_dir}/${file_name}`, (err, data) => {

            if ( ! err && data) {

                callabck(false, data);
            } else {
                callabck('no file could be found');
            }
        });

    } else {

        callabck('File name is not valid');
    }
}

// Export the module
module.exports = helpers;