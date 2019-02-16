/**
 * Workers - (back-end tasks)
 * 
**/

/**
 * Dependencies
 */

// Node modules
var 
    path  = require('path'),
    fs    = require('fs'),
    https = require('https'),
    http = require('http'),
    url = require('url'),
    util = require('util'),
    debug = util.debuglog('workers');
        
// Custom app modules
var 
    _data   = require('./data'),
    helpers = require('./helpers'),
    _logs   = require('./logs');


// Set up the workers container
 var workers = {};


 // ----------------------------------------------//
//---- checks workers logic -----------------------//
//-----------------------------------------------//

/**
 * Add data to a log file
 */
workers.log = (original_check_data, check_outcome, state, alert_warranted, time_of_check) => {
    
    var 
        // Form the log data
        log_data = {
            check: original_check_data,
            outcome: check_outcome,
            state: state,
            alert: alert_warranted,
            time: time_of_check
        },
        // Convert data to a string
        log_string = JSON.stringify(log_data),
        // Determine the name of the log file
        // We are going to write each check with its owen log file
        log_file_name = original_check_data.id;

        // Append the log string to the end of the log file

        _logs.append(log_file_name, log_string, (err) => {
            if ( ! err) {
                debug('Logging to the file succeeded');

            } else {
                debug('Logging to the file filed');
            }
        });
}

/**
 * Lookup all checks, get their data & send it to a validator
 */
workers.gather_all_checks = function() {
    // Get all the checks that exists in the system
    _data.list('checks', function(err, checks_names){

        if ( ! err && checks_names && checks_names.length > 0) {

            checks_names.forEach(function(check_name){

                debug('Executing ' + check_name)
                _data.read('checks', check_name, function(err, original_check_data){

                    if ( ! err && original_check_data) {
                        // Pass the check data to the check validator
                        workers.validate_check_data(original_check_data);
                    } else {
                        debug('Error while trying to read ' + check + '.json');  
                    }
                });

                debug('----------------');
            });
        } else {

            debug('No checks were found');
        }

    });
}

/**
 * Sanity check the check-data
 */
workers.validate_check_data = function(original_check_data) {
    // Get the url, protocol and make http/https call
    // Compare the result http code to the "successCodes" array (indexOf)
    // if success code exists - write it in a log file
    // else console log the bad result
    original_check_data = 
        typeof(original_check_data) == 'object'  && original_check_data !== null 
            ? original_check_data
            : {};

    original_check_data.id = 
        typeof(original_check_data.id) == 'string' && original_check_data.id.trim().length == 20
            ? original_check_data.id.trim()
            : false;

    var original_phone = original_check_data.user_phone;

    original_check_data.user_phone = 
        typeof(original_check_data.user_phone) == 'string' && original_check_data.user_phone.trim().length == 12
            ? original_check_data.user_phone.trim()
            : false;
    
    var allowed_protocols =  [ 'http', 'https' ];
    original_check_data.protocol =
        typeof(original_check_data.protocol) === 'string' && allowed_protocols.indexOf(original_check_data.protocol) > -1
            ? original_check_data.protocol
            : false;

    original_check_data.url =
        typeof(original_check_data.url) === 'string' && original_check_data.url.trim().length > 0
            ? original_check_data.url.trim()
            : false;
    
    var allowed_methods = [ 'post', 'put', 'get', 'delete' ];
    original_check_data.method =
            typeof(original_check_data.method) === 'string' && allowed_methods.indexOf(original_check_data.method) > -1
                ? original_check_data.method
                : false;
    
    original_check_data.successCodes =
            typeof(original_check_data.successCodes) === 'object' && original_check_data.successCodes instanceof Array && original_check_data.successCodes.length > 0
                ? original_check_data.successCodes
                : false;

    original_check_data.timeoutSeconds =
            typeof(original_check_data.timeoutSeconds) === 'number' && original_check_data.timeoutSeconds % 1 === 0 && original_check_data.timeoutSeconds >= 1 && original_check_data.timeoutSeconds <= 5
                ? original_check_data.timeoutSeconds
                : false;

    // Set the keys that may not be set (if workers have nevr seen this check before)

    // Indication if the url to checkl is up/ down (returns one of the excpected http codes)
    var allowed_states = ['up', 'down'];
    original_check_data.state =
        typeof(original_check_data.state) === 'string' && allowed_states.indexOf(original_check_data.state) > -1
                ? original_check_data.state
                : 'down';

    // Time stamp of the last time the check was made
    original_check_data.last_checked =
            typeof(original_check_data.last_checked) === 'number' && original_check_data.last_checked > 0
                ? original_check_data.last_checked
                : false;

    var 
        is_valid = true,
        check_keys_to_validate = [ 'id', 'user_phone', 'protocol', 'url', 'method', 'successCodes', 'timeoutSeconds'];

    for (var i = 0; i < check_keys_to_validate.length; i++) {

        var check_key_to_valiadate = check_keys_to_validate[i];
        if ( ! original_check_data[check_key_to_valiadate]) {
            is_valid = false;
            break;
        }
    }

    if (original_check_data && is_valid) {

        // Validation is sucssefull - continue to the check
        workers.preform_check(original_check_data);
    } else {
        debug('Check data is not valid');
        debug('original_check_data', original_check_data);
        debug('original_check_data.user_phone.trim().length', original_phone.length);
        debug('original_check_data.user_phone', original_phone);
    }
}

/**
 * Preform http check and send the data to the next step in the process
 */
workers.preform_check = function(original_check_data) {
    var 
        // Prepare their initial check outcome
        check_outcome = {
            error: false,
            response_code: false
        },
        // Mark that the outcome has not been sent yet
        has_outcome_sent = false,
        // Parse the url into special object (will have query, host name, path and more in it)
        parsed_url = url.parse(original_check_data.protocol + '://' + original_check_data.url, true),
        hostname   = parsed_url.hostname,
        // We need to uae the path and not the path name becayse path will contain the query string (which user might send)
        path = parsed_url.path;

    // Construct the request
    var request_details = {
        // @TODO - seems like i can use parsed_url.protocol which comes prepared with this sofix
        protocol: original_check_data.protocol + ':',
        hostname: hostname,
        method: original_check_data.method.toUpperCase(),
        path: path,
        // This key expecting miliseconds
        timeout: original_check_data.timeoutSeconds * 1000
    };

    // Instansiate the request object using http/https module
    var _request_module_to_use = original_check_data.protocol == 'https' 
        ? https 
        : http;

    var request = _request_module_to_use.request(request_details, function(http_response){

        var http_response_status = http_response.statusCode;
        check_outcome.response_code = http_response_status;
        if ( ! has_outcome_sent) {
            workers.process_check_outcome(original_check_data, check_outcome);
            has_outcome_sent = true;
        }
        // This is for debuging...
        // http_response.on('data', function (http_response_body) {
        //     debug('HTTP Response Body');
        //     debug(JSON.parse(http_response_body));
        // });
    });

    // Bind to the error event so it will not be thrown
    request.on('error', function(error){
        debug('Internal node request error while in workers');
        debug('error', error);

        check_outcome.error = {
            error: true,
            value: error
        }
            
        if ( ! has_outcome_sent) {
            workers.process_check_outcome(original_check_data, check_outcome);
            has_outcome_sent = true;
        }
    });

    // Bind to the timeout event so it will not be thrown
    // this is cause due to the "timeoutSeconds" that user wish to check so if the request exeeds this time - it will be a time out error
    request.on('timeout', function(error){
        debug('Internal node request timeout error while in workers');
        debug('error', error);

        check_outcome.error = {
            error: true,
            value: 'timeout'
        }
            
        if ( ! has_outcome_sent) {
            workers.process_check_outcome(original_check_data, check_outcome);
            has_outcome_sent = true;
        }
    });

    // End the request
    // This is also be sending the request and it will start the response/ error scycle
    request.end();
}

// Process check outcome, update the check and trigger alert for the user
// We will have special logic in here for accommodating a check that has never been tested before == do not alret on that one
// e.g - initial stat was down and it changed to up - do not send anything since this is the first time we made the check
workers.process_check_outcome = function(original_check_data, check_outcome) {
    var 
        // Find out if check is up
        is_check_up =  
            ! check_outcome.error && 
            check_outcome.response_code && 
            original_check_data.successCodes.indexOf(check_outcome.response_code) > -1,
        // Set the check accordingly
        state = is_check_up ? 'up' : 'down'; 
    
    // Decide if an alert is needed
    // We will alert the users only if state changed (from up to down or from down to up)

    var 
        alert_warranted = original_check_data.last_checked && original_check_data.state !== state,
        time_of_check   = Date.now();


     // Log the outcome of the check
     workers.log(original_check_data, check_outcome, state, alert_warranted, time_of_check );

    // Update the check data
    var new_check_data = original_check_data;
    new_check_data.state = state;
    new_check_data.last_checked = time_of_check;

    _data.update('checks',new_check_data.id, new_check_data, function(err){

        if ( ! err) {

            // In case alert needs to be send to the user - pass the new check data to the next worker
            if (alert_warranted) {
                workers.alert_users_to_status_change(new_check_data);
            } else {
                var 
                    method         = new_check_data.method.toUpperCase(),
                    full_url       = new_check_data.protocol + '://' + new_check_data.url,
                    message        = `${method} ${full_url} is ${state} as expected`;
                // Log to console
                debug('Check outcome has not changed, alert is not needed');
                debug('Check message:', message);
            }

        } else {
            debug('Error while processing check outcome');
        }
    });

}

// Alert the users when status has changed in one of their checks
workers.alert_users_to_status_change = (new_check_data) => {
    var 
        method         = new_check_data.method.toUpperCase(),
        full_url       = new_check_data.protocol + '://' + new_check_data.url,
        state          = new_check_data.state,
        previous_state = new_check_data.state == 'up' ? 'down' : 'up',
        message        = `Alert: your state on ${method} ${full_url} has changed from ${previous_state} to ${state}`;
    
    helpers.send_twilio_sms(new_check_data.user_phone, message, function(err){

        if ( ! err) {
            debug('Success: message was sent:', message);
        } else {
            debug('Error: Problem with sending alert to the user');
        }
    });
}


// ----------------------------------------------//
//---- Logs workers logic -----------------------//
//-----------------------------------------------//

workers.rotate_logs = () => {
    // List all (none compressed log) files

    _logs.list(false, (err, logs) => {
        if (! err && logs && logs.length) {

            logs.forEach((log_name) => {

                // Compress the data to a different file

                let 
                    log_id      = log_name.replace('.log', ''),
                    new_file_id = log_id + '-' + Date.now();

                _logs.compress(log_id, new_file_id, (err) => {

                    if ( ! err) {
                        // Truncate the log ==> clean up the log from all of the data  -
                        // - so each day this log will have fresh log data only 

                        _logs.truncate(log_id, (err) => {
                            if ( ! err) {
                                debug(`Success: log was compressed and truncated successfully`);
                            } else {
                                debug(`Error: could not truncate the log:`, err);
                            }
                        });
                    } else {
                        debug(`Error: could not compress the log:`, err);
                    }
                });
            });
        } else {
            debug(`Error: could not find any logs to rotate`);
        }
    });
}


//--------------------------------------------------------//
//------ Initialize all workers logic -------------------//
//------------------------------------------------------//

// Timer to execute the worker process once per minute
workers.loop = function() {
    // Is been executed once per minute
    setInterval(function(){
        workers.gather_all_checks();
    }, 1000 * 5);
}

// Timer to execute the log rotation process once per day
workers.log_rotation_loop = function() {
    // Is been executed once per day
    setInterval(function(){
        workers.rotate_logs();
    }, 1000 * 60 * 60 * 24);
}

// Init function - will be executed when app is initialized
 workers.init = function() {

    // Notify about workers init (in yellow)
    console.log('\x1b[33m%s\x1b[0m', 'Background workers are running');
    console.log('..............................');
    // Execute all the checks as soon as the function starts up
    workers.gather_all_checks();

    // Call all a loop so the checks will be executed on their own
    workers.loop();

    // Compress all logs immediately
    workers.rotate_logs();

    // Call the compression loop so logs will be compressed later on
    // @TODO again bad function name.. :-(
    workers.log_rotation_loop();

 }

// Export the workers obj
 module.exports = workers;