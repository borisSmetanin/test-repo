/**
 * Request handlers
 */

 // Dependencies

 var _data = require('./data');
 var helpers = require('./helpers');
var config = require('./config');

// Define the request handlers
var handlers = {}
/**
 * HTML Handlers
 */
// Index handler

handlers.index = (data, callback) => {

    // Reject any request that isn't a GET request
    if (data.method == 'get') {

        // Prepare data for interpolation

        let template_data = {
            'head.title': 'Uptime Monitoring - Made simple' ,
            'head.description': `We offer free simple monitoring for HTTP/HTTPS sites of all kinds. When your site goes down - we'll send you a text to let you know`,
            'body.class': 'index'
        }

        // Read in the index template as a string
        helpers.get_template('index', template_data, (err, template_str) => {
            if ( ! err && template_str) {
                helpers.add_universal_templates(template_str, template_data, (err, full_html_string) => {

                    if ( ! err && full_html_string) {

                        callback(200, full_html_string, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
        
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
    
}

// Create a session page
handlers.session_create = (data, callback) => {
    // Reject any request that isn't a GET request
    if (data.method == 'get') {

        // Prepare data for interpolation

        let template_data = {
            'head.title': 'Log In to your Account' ,
            'head.description': `Please enter your phone number and password to access your account`,
            'body.class': 'accountCreate'
        }

        // Read in the index template as a string
        helpers.get_template('session_create', template_data, (err, template_str) => {
            if ( ! err && template_str) {
                helpers.add_universal_templates(template_str, template_data, (err, full_html_string) => {

                    if ( ! err && full_html_string) {

                        callback(200, full_html_string, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
        
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Create an Account
handlers.account_create = (data, callback) => {
     // Reject any request that isn't a GET request
     if (data.method == 'get') {

        // Prepare data for interpolation

        let template_data = {
            'head.title': 'Create an account' ,
            'head.description': `Sign up is easy and only takes a few seconds`,
            'body.class': 'sessionCreate'
        }

        // Read in the index template as a string
        helpers.get_template('account_create', template_data, (err, template_str) => {
            if ( ! err && template_str) {
                helpers.add_universal_templates(template_str, template_data, (err, full_html_string) => {

                    if ( ! err && full_html_string) {

                        callback(200, full_html_string, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
        
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Delete a session page
handlers.session_deleted = (data, callback) => {
    // Reject any request that isn't a GET request
    if (data.method == 'get') {

        // Prepare data for interpolation

        let template_data = {
            'head.title': 'logged Out' ,
            'head.description': `You have been logged out of your account`,
            'body.class': 'sessionDeleted'
        }

        // Read in the index template as a string
        helpers.get_template('session_deleted', template_data, (err, template_str) => {
            if ( ! err && template_str) {
                helpers.add_universal_templates(template_str, template_data, (err, full_html_string) => {

                    if ( ! err && full_html_string) {

                        callback(200, full_html_string, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
        
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Edit the account
handlers.account_edit = (data, callback) => {

    if (data.method == 'get') {

        // Prepare data for interpolation

        let template_data = {
            'head.title': 'Account Settings' ,
            'body.class': 'accountEdit'
        }

        // Read in the index template as a string
        helpers.get_template('account_edit', template_data, (err, template_str) => {
            if ( ! err && template_str) {
                helpers.add_universal_templates(template_str, template_data, (err, full_html_string) => {

                    if ( ! err && full_html_string) {

                        callback(200, full_html_string, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
        
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Account has been deleted page
handlers.account_deleted = (data, callback) => {

    if (data.method == 'get') {

        // Prepare data for interpolation

        let template_data = {
            'head.title': 'Account Deleted',
            'head.description': `Your account has been deleted`,
            'body.class': 'accountDeleted'
        }

        // Read in the index template as a string
        helpers.get_template('account_deleted', template_data, (err, template_str) => {
            if ( ! err && template_str) {
                helpers.add_universal_templates(template_str, template_data, (err, full_html_string) => {

                    if ( ! err && full_html_string) {

                        callback(200, full_html_string, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
        
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Create a new check
handlers.check_create = (data, callback) => {

    if (data.method == 'get') {

        // Prepare data for interpolation

        let template_data = {
            'head.title': 'Create a New Check',
            'body.class': 'checksCreate'
        }

        // Read in the index template as a string
        helpers.get_template('checks_create', template_data, (err, template_str) => {
            if ( ! err && template_str) {
                helpers.add_universal_templates(template_str, template_data, (err, full_html_string) => {

                    if ( ! err && full_html_string) {

                        callback(200, full_html_string, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
        
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Show checks dashboard
handlers.check_list = (data, callback) => {

    if (data.method == 'get') {

        // Prepare data for interpolation

        let template_data = {
            'head.title': 'Checks Dashboard',
            'body.class': 'checksList'
        }

        // Read in the index template as a string
        helpers.get_template('check_list', template_data, (err, template_str) => {
            if ( ! err && template_str) {
                helpers.add_universal_templates(template_str, template_data, (err, full_html_string) => {

                    if ( ! err && full_html_string) {

                        callback(200, full_html_string, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
        
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}


// Serve the Favicon.icon data
handlers.favicon = (data, callback) => {

    // Reject any request that isn't a GET request
    if (data.method == 'get') {

        // Read the favicon data

        helpers.get_static_assets('favicon.ico', (err, data) => {

            if ( ! err && data) {

                callback(200, data, 'favicon');
            } else {
                callback(500); 
            }
        });

    } else {
        callback(405);
    }
}

// Public Assets

handlers.public = (data, callback) => {
     // Reject any request that isn't a GET request
     if (data.method == 'get') {

        // Get the filename being requested
        let trimmed_asset_name = data.trimmedPath.replace('public/','').trim();


        if (trimmed_asset_name.length > 0) {

            // Read the assets data
            helpers.get_static_assets(trimmed_asset_name, (err, data) => {

                if ( ! err && data) {

                    // Determent the content type of the file by the file name (default to plain text)
                    let content_type = 'plain';


                    if (trimmed_asset_name.indexOf('.css') > -1) {
                        content_type = 'css';
                    }

                    if (trimmed_asset_name.indexOf('.png') > -1) {
                        content_type = 'png';
                    }

                    if (trimmed_asset_name.indexOf('.jpg') > -1) {
                        content_type = 'jpg';
                    }

                    if (trimmed_asset_name.indexOf('.ico') > -1) {
                        content_type = 'favicon';
                    }

                    callback(200, data, content_type);
                } else {
                    callback(404);
                }
            });

        } else {
            callback(404);
        }
     } else {
        callback(405);
     }
}


/**
 * JSON API Handlers
 */
// New route for /users
// This function will figure out which method im using and pass it to the correct handler
handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(404, {
            Error: 'Method + route are not found'
        });
    }
}

// Container for user's sub-methods
handlers._users = {};

/**
 * POST /users
 * 
 * Required data:
 * - firstName
 * - lastName
 * - phone
 * - password
 * - tosAgreement (bool)
 * 
 * Optional data: none
 * 
 * 
 * @param {Object} data 
 * @param {function} callback 
 */
handlers._users.post = function (data, callback) {
    
    // Check all required field are filled out
    var firstName =
        typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0
        ? data.payload.firstName.trim()
        : false;

    var lastName =
        typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0
        ? data.payload.lastName.trim()
        : false;

    var phone =
        typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 12
        ? data.payload.phone.trim()
        : false;

    var password =
        typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0
        ? data.payload.password.trim()
        : false;

    var tosAgreement = typeof(data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement == true;

    if (firstName && lastName && phone && password && tosAgreement ) {
        // Make sure that the user does not already exists
        // Try to read users file to check if user exists
        _data.read('users', phone, function(error, data){
            
            if (error) {
                // User does not exist - continue

                // Hash the password with build in library
                var hashedPassword = helpers.hash(password);

                if (hashedPassword) {

                    // Create user's object
                    var userObject = {
                        firstName: firstName,
                        lastName: lastName,
                        phone: phone,
                        hashedPassword: hashedPassword,
                        tosAgreement: true,
                    };

                    // Store the user in our custom file system
                    _data.create('users', phone, userObject ,function(err){

                        if ( ! err) {

                            // No error - user was create successfully
                            callback(200, {
                                Success: 'User was created successfully!'
                            });
                        } else {

                            // Error in creating the user - log it and notify the caller
                            console.log(err);

                            callback(500, {
                                Error: 'Could not create the new user'
                            })
                        }
                    });
                } else {

                    callback(500, {
                        Error: 'Could not hash the user\'s password'
                    });
                }
                
            }else{
                // User already exists - callback an error

                callback(400, {
                    Error: 'User already exists with this phone number'
                })
            }
        });
    } else {
        callback(400, {
            Error: 'Missing required fields' 
        });
    }
}

/**
 * GET /users
 * 
 * Required data:
 *  - phone
 * 
 * Optional data: none
 * 
 * @TODO in my homework - i should build get_collection and get. phone number should be passed in the GET /users/<phone_number>
 *  
 * @param {JSON} data 
 * @param {function} callback 
 */
handlers._users.get = function (data, callback) {
    // Check that the phone number is valid

    var phone = 
        typeof data.queryStringObject.phone == 'string' && 
        data.queryStringObject.phone.trim().length === 12
            ? data.queryStringObject.phone.trim()
            : false;

    if (phone) {

        // Get the token from the header

        var token = typeof data.headers.token == 'string' 
            ? data.headers.token 
            : false;

        // Validate that given token from the headers is valid for the phone number
        handlers._tokens.verify_token(token, phone, function(is_valid_token){

            if (is_valid_token) {
                // Get the user
                _data.read('users', phone, function (err, user){

                    if ( ! err && user) {
                        // Remove the hashed password from the user object before return it to the caller
                        delete user.hashedPassword;

                        callback(200, user);
                    } else {
                        callback(404, {
                            Error: 'User was not found'
                        });
                    }
                });
            } else {
                callback(403, {
                    Error: "Invalid token was supplied - either missing or invalid"
                });
            }
        });

    } else {
        callback(400, {
            Error: 'Pleas provide a valid phone number'
        });
    }
}

/**
 * PUT /users
 * 
 * Required data:
 *  - phone
 * 
 * Optional data (at least one must be specified):
 * - firstName
 * - lastName
 * - password
 * 
 * @TODO let only authenticated users access to their own data and nobody elses data
 * 
 * @param {Object} data 
 * @param {function} callback 
 */
handlers._users.put = function (data, callback) {
    // Check for the require fields
    var phone = 
        typeof data.payload.phone == 'string' && 
        data.payload.phone.trim().length === 12
            ? data.payload.phone.trim()
            : false;

    // Check for optional fields
    var firstName =
        typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0
            ? data.payload.firstName.trim()
            : false;

    var lastName =
        typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0
            ? data.payload.lastName.trim()
            : false;

    var password =
        typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0
            ? data.payload.password.trim()
            : false;

    
    if (phone) {



        // Continue only if phone is valid

        if (firstName || lastName || password) {

             // Get the token from the header

            var token = typeof data.headers.token == 'string' 
            ? data.headers.token 
            : false;

            // Validate that given token from the headers is valid for the phone number
            handlers._tokens.verify_token(token, phone, function(is_valid_token){

                if (is_valid_token) {
                    // Get the user - check if user exists before we update him
                    _data.read('users', phone, function(err, userData){
                        if ( ! err && userData) {
    
                            // Update the necessary fields
                            // @TODO i should do this part with a loop
    
                            if (firstName) {
                                userData.firstName = firstName;
                            }
    
                            if (lastName) {
                                userData.lastName = lastName;
                            }
    
                            if (password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
    
                            // Store the new update
                            _data.update('users', phone, userData, function(err){
                                if ( ! err) {
                                    callback(200, {
                                        Success: 'User was Successfully updated'
                                    });
                                } else {
                                    console.log(err)
                                    callback(500, {
                                        Error: 'Could not update the user'
                                    });
                                }
                            });
    
                        } else {
                            callback(404, {
                                Error: 'User was not found' 
                            });
                        }
                    });
                } else {
                    callback(403, {
                        Error: "Invalid token was supplied - either missing or invalid"
                    });
                }

            });
           
        } else {
            callback(400, {
                Error: 'Pleas provide data to update'
            });
        }

    } else {
        callback(400, {
            Error: 'Pleas provide a valid phone number'
        });
    }

}

/**
 * DELETE /users
 * 
 * Required data:
 *  - phone
 * 
 * Optional data: none
 * 
 * @param {object} data 
 * @param {function} callback 
 * 
 */
handlers._users.delete = function (data, callback) {
     // Check that the phone number is valid

    var phone = 
    typeof data.queryStringObject.phone == 'string' && 
    data.queryStringObject.phone.trim().length === 12
        ? data.queryStringObject.phone.trim()
        : false;

    if (phone) {

        
        var token = typeof data.headers.token == 'string' 
        ? data.headers.token 
        : false;

        // Validate that given token from the headers is valid for the phone number
        handlers._tokens.verify_token(token, phone, function(is_valid_token){
            if (is_valid_token) {
                // Get the user
                // TODO - im my app i will call it user and not data. data is generic and not clear
            _data.read('users', phone, function (err, user_data){
            
                    if ( ! err) {
                        _data.delete('users', phone, function(err) {
                        if ( ! err) {
            
                            // Delete each of the checks associative to the user
                            var user_checks = typeof(user_data.checks) == 'object' && user_data.checks instanceof Array
                                ?  user_data.checks
                                : [];
                            
                            if (user_checks.length > 0) {

                                var deleted_checks  = 0,
                                    deletion_errors = false;

                                // Loop through the checks and delete them
                                user_checks.forEach(function(check_id){
                                    _data.delete('checks', check_id, function(err) {
                                        if (err) {
                                            deletion_errors = true;
                                        }

                                        deleted_checks ++;
                                        // Loop has ended 
                                        if (deleted_checks == user_checks.length) {

                                            // No error detected - A-OK
                                            if ( ! deletion_errors) {
                                                callback(200, {
                                                    Success: 'User was deleted successfully (with all of its checks)'
                                                });
                                            } else {
                                                callback(500,  {
                                                    Error: 'Some of the user\'s checks were not deleted'
                                                });
                                            }
                                        }   
                                    });
                                });    
                            } else {
                                // Noo need to delete the users checks
                                callback(200, {
                                    Success: 'User was deleted successfully'
                                });
                            }
            
                        } else {
                            
                            console.log(err)
                            callback(500, {
                                Error: 'Could not delete the user'
                            });
                        }
                        });
                    
                    } else {
                        callback(404, {
                            Error: 'User was not found'
                        });
                    }
            });
            } else {
                callback(403, {
                    Error: "Invalid token was supplied - either missing or invalid"
                });
            }
        });

    } else {
        callback(400, {
            Error: 'Pleas provide a valid phone number'
        });
    }
}


// Container for Tokens methods
var _tokens = {};

// New handlers for tokens
// Handel's all requests coming to /users
handlers.tokens = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(404, {
            Error: 'Method + route are not found'
        });
    }
}

handlers._tokens = {};
/**
 * POST /tokens
 * 
 * Required data:
 * - phone
 * - password
 * 
 * Optional data: none
 * 
 * @param data {object}
 * @param callback {function}
 */
handlers._tokens.post = function(data, callback) {

    var phone =
        typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 12
        ? data.payload.phone.trim()
        : false;

    var password =
        typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0
        ? data.payload.password.trim()
        : false;

        if (phone && password) {

            // Lookup the user who matches the phone number
            _data.read('users', phone, function(error, userData){
                if ( ! error){

                    // Hash the sent password and compare it to the existing password of the stored users
                    if (userData.hashedPassword && helpers.hash(password) == userData.hashedPassword) {

                        // Creat ne token with random name.
                        // Set exportation date one hour in the future

                        var 
                            token_id = helpers.create_random_string(20),
                            expires = Date.now() + (1000 * 60 * 60),
                            token_object = {
                               phone: phone,
                               id: token_id,
                               expires: expires
                            };


                        _data.create('tokens', token_id, token_object, function(error){
                            if ( ! error) {

                                callback(200,token_object);
                            } else {
                                callback(500, {
                                    Error: 'Could not creat a token'
                                })
                            }

                        });

                    } else {
                        callback(404, {
                            Error: 'Can not creat token - password do not match'
                        });  
                    }

                } else {
                    callback(404, {
                        Error: 'User was not found'
                    });
                }
            });

        } else {
            callback(400, {
                Error: 'Must provide phone number and password for creating a token'
            });
        }

}

/**
 * GET /tokens
 * 
 * Required data:
 * - id
 * 
 * Optional data: none
 * 
 */
handlers._tokens.get = function(data, callback) {
    // Check token id is valid
    var token_id = 
    typeof data.queryStringObject.id == 'string' && 
    // TODO this is bad practice: 20 should be kept as an constant so i can reuse it
    data.queryStringObject.id.trim().length === 20
        ? data.queryStringObject.id.trim()
        : false;

    if (token_id) {

        // Get the token
        _data.read('tokens', token_id, function (err, token_data){

            if ( ! err && token_data) {
              
                callback(200, token_data);
            } else {
                callback(404, {
                    Error: 'Token was not found'
                });
            }
        });

    } else {
        callback(400, {
            Error: 'Pleas provide a token id'
        });
    }

}

/**
 * PUT /tokens
 * 
 * Required data:
 * - id
 * - extend
 * 
 *  Optional data: none
 */
handlers._tokens.put = function(data, callback) {
    
    // Get the token id

     // Check token id is valid
     var token_id = 
        typeof data.payload.id == 'string' && 
        // TODO this is bad practice: 20 should be kept as an constant so i can reuse it
        data.payload.id.trim().length === 20
            ? data.payload.id.trim()
            : false;

    // TODO this is bad practice: 20 should be kept as an constant so i can reuse it
    var extend = 
        typeof data.payload.extend == 'boolean' && 
        data.payload.extend

    if (token_id && extend) {

        _data.read('tokens', token_id, function (err, token_data){

            if ( ! err && token_data) {
              
                // Check if token was not expired
                if (Date.now() < token_data.expires) {
                    // Extend the token for 1 hour and update this token
                    token_data.expires = Date.now() + (1000 * 60 * 60);
                    
                    // Update this token
                    _data.update('tokens', token_id, token_data, function(err){
                        if ( ! err){
    
                            callback(200);
                        } else {
                            callback(500, {
                                Error: 'Internal error while updating token'
                            });
                        }
                    });
                } else { 

                    callback(405, {
                        Error: 'Token was expired, pleas creat a new one'
                    });
                }


                
            } else {
                callback(404, {
                    Error: 'Token was not found'
                });
            }
        })

    } else {
        callback(400, {
            Error: 'Invalid extend request was provided'
        });
    }
           

    // extend the token for another 1 hour
    // TODO feels like extend= true is redundant
}

/**
 * DELETE /tokens
 * 
 * Required data:
 * - id
 * 
 */
handlers._tokens.delete = function(data, callback) {
     // Check token id is valid
     var token_id = 
        typeof data.payload.id == 'string' && 
        // TODO this is bad practice: 20 should be kept as an constant so i can reuse it
        data.payload.id.trim().length === 20
            ? data.payload.id.trim()
            : false;

    if (token_id) {

        _data.read('tokens', token_id, function(err, token_data){
            if ( ! err) {
                _data.delete('tokens', token_id, function(err){
                    if ( ! err) {
                        callback(200, {
                            Success: "token was Successfully deleted"
                        })
                    } else {
                        callback(500, {
                            Error: 'Internal error while deleting a token'
                        });
                    }
                });
            } else { 
                callback(404, {
                    Error: 'Token was not found'
                });
            }
        });

    } else {
        callback(405, {
            Error: 'Invalid token ID was provided'
        });
    }
}


/**
 * Verify users token is valid
 * 
 * @param {string}   token_id
 * @param {string}   user_phone
 * @param {function} callback
 * 
 */
handlers._tokens.verify_token = function(token_id, user_phone, callback) {

    // Lookup the token

    _data.read('tokens', token_id, function(err, token_data){

        if ( ! err) {

            // Check up that the token is for the given user && that token is not expired
            if (token_data.phone === user_phone && Date.now() < token_data.expires) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false); 
        }
    });


}

/*********************** Checks Service ******************************/
// Container for Checks handler
handlers._checks = {};


// New handlers for tokens
// Handel's all requests coming to /checks
handlers.checks = function (data, callback) {
    var acceptableMethods = [ 'post', 'get', 'put', 'delete' ];

    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(404, {
            Error: 'Method + route are not found'
        });
    }
}

/**
 * @TODO need to understand what the hell this thing is for 
 * @TODO i think this is for background workers of some kind
 * 
 *  POST /checks
 * 
 * Required data:
 * - protocol
 * - url
 * - method
 * - successCode (array)
 * - timeoutSeconds
 * 
 * Optional data: none
 * 
 */
handlers._checks.post = function(data, callback) {

    // Validate inputs
    var allowed_protocols =  [ 'http', 'https' ],
        protocol =
            typeof(data.payload.protocol) === 'string' && allowed_protocols.indexOf(data.payload.protocol) > -1
                ? data.payload.protocol
                : false;

    var url =
        typeof(data.payload.url) === 'string' && data.payload.url.trim().length > 0
            ? data.payload.url.trim()
            : false;

    var allowed_methods = [ 'post', 'put', 'get', 'delete' ],
        method =
            typeof(data.payload.method) === 'string' && allowed_methods.indexOf(data.payload.method) > -1
                ? data.payload.method
                : false;
    
    var successCodes =
            typeof(data.payload.successCodes) === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0
                ? data.payload.successCodes
                : false;

    var timeoutSeconds =
            typeof(data.payload.timeoutSeconds) === 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5
                ? data.payload.timeoutSeconds
                : false;
    
    if (protocol && url && method && successCodes && timeoutSeconds) {

        // Get the token from the headers
        var token = typeof data.headers.token == 'string' 
            ? data.headers.token 
            : false;
        
        // Lookup the user by reading the token

        _data.read('tokens', token, function name(err, token_data) {
            
            if ( ! err && token_data) {

                var user_phone = token_data.phone;

                // Lookup the user
                _data.read('users', user_phone, function(err, user_data){

                    if ( ! err && user_data) {

                        // Get existing users checks
                        var user_checks = typeof(user_data.checks) == 'object' && user_data.checks instanceof Array
                            ?  user_data.checks
                            : [];

                        // Validate that user has less then the max allowed number of checks per user
                        if (user_checks.length < config.maxChecks) {

                            // Create a random id for the check
                            var check_id = helpers.create_random_string(20);

                            // Creat the check object and include the users phone
                            var check_object = {
                                id : check_id,
                                user_phone: user_phone,
                                protocol: protocol,
                                url: url,
                                method: method,
                                successCodes: successCodes,
                                timeoutSeconds: timeoutSeconds
                            }

                            // Save the check object in the checks collection
                            _data.create('checks', check_id, check_object, function(err){

                                if ( ! err) {

                                    // Add the check id to the user's data
                                    user_checks.push(check_id);
                                    user_data.checks = user_checks;

                                    // Update the user
                                    _data.update('users', user_phone, user_data, function(err){
                                        if ( ! err) {
                                            callback(200, {
                                                Success: 'Check was created successfully',
                                                success_payload: check_object
                                            });
                                        } else {
                                            callback(500, {
                                                Error: 'Could not update the user with the new check'
                                            });
                                        }
                                    });
                                    

                                } else {

                                    callback(500, {
                                        Error: 'Error while creating the check object'
                                    });
                                }
                            });

                            // user_checks.push({

                            // });
                        } else {
                            callback(404, {
                                Error: 'You have surpassed the max allowed checks: ' + config.maxChecks
                            });
                        }

                        // Now we need to add the user checks to the user data

                    } else {
                        callback(403, {
                            Error: 'User was not found with this token'
                        }) 
                    }
                });
            } else {

                callback(403, {
                    Error: 'Not authorized token was provided'
                });
            }
        });

    } else {
        callback(400, {
            Error: 'Failed to validate check creation - missing required inputs or inputs are invalid'
        });
    }

}

/**
 * GET /checks
 * Required data
 * - id
 * 
 * Optional data: none
 */
handlers._checks.get = function(data, callback) {

    var check_id = 
        typeof data.queryStringObject.id == 'string' && data.queryStringObject.id.trim().length == 20
            ? data.queryStringObject.id.trim()
            : false;

    if (check_id) {

        // Lookup the check (for token validation)
        _data.read('checks', check_id, function(err, check_data){

            if ( ! err) {
                // Get the token from the header
                var token = typeof data.headers.token == 'string' 
                    ? data.headers.token.trim() 
                    : false;
        
                // Validate that given token from the headers is valid for the id
                handlers._tokens.verify_token(token, check_data.user_phone, function(is_valid_token){
        
                    if (is_valid_token) {
                        // Get the check
                       callback(200,check_data);
                    } else {
                        callback(403, {
                            Error: "Invalid token was supplied - either missing or invalid"
                        });
                    }
                });
            } else {
                callback(404, {
                    Error: 'Check was not found'
                });
            }
        });
    } else {
        callback(400, {
            Error: 'Pleas provide a valid check id'
        });
    }
}

/**
 * PUT /checks
 * Required data:
 * - id
 * 
 * Optional data:
 * - protocol
 * - url
 * - method
 * - successCode (array)
 * - timeoutSeconds
 * 
 * Optional data: none
 */
handlers._checks.put = function(data, callback) {
    // Check for the require fields
    var id = 
        typeof data.payload.id == 'string' && 
        data.payload.id.trim().length === 20
            ? data.payload.id.trim()
            : false;

                // Validate inputs
    var allowed_protocols =  [ 'http', 'https' ],
        protocol = typeof(data.payload.protocol) === 'string' && allowed_protocols.indexOf(data.payload.protocol) > -1
            ? data.payload.protocol
            : false;

    var url =
        typeof(data.payload.url) === 'string' && data.payload.url.trim().length > 0
            ? data.payload.url.trim()
            : false;

    var allowed_methods = [ 'post', 'put', 'get', 'delete' ],
        method =
            typeof(data.payload.method) === 'string' && allowed_methods.indexOf(data.payload.method) > -1
                ? data.payload.method
                : false;

    var successCodes =
            typeof(data.payload.successCodes) === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0
                ? data.payload.successCodes
                : false;

    var timeoutSeconds =
            typeof(data.payload.timeoutSeconds) === 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5
                ? data.payload.timeoutSeconds
                : false;

    // Validate id
    if (id) {

        // Validate required fields were provided
        if (protocol || url || method || successCodes || timeoutSeconds) {

            _data.read('checks', id, function(err, check_data){

                if ( ! err && check_data) {

                    var token = typeof data.headers.token == 'string' 
                        ? data.headers.token.trim() 
                        : false;
        
                    // Validate that given token from the headers is valid for the id
                    handlers._tokens.verify_token(token, check_data.user_phone, function(is_valid_token){
            
                        // Update the check if token is valid
                        if (is_valid_token) {
                            
                            if (protocol) {
                                check_data.protocol = protocol;
                            }

                            if (url) {
                                check_data.url = url;
                            }

                            if (method) {
                                check_data.method = method;
                            }

                            if (successCodes) {
                                check_data.successCodes = successCodes;
                            }

                            if (timeoutSeconds) {
                                check_data.timeoutSeconds = timeoutSeconds;
                            }

                            _data.update('checks', id, check_data, function(err){

                                if ( ! err) {

                                    callback(200, {
                                        Success: 'Check was updated Successfully!'
                                    });
                                } else {
                                    callback(500, {
                                        Error: 'Internal error while updating the token'
                                    })
                                }

                            });
                        } else {
                            callback(403, {
                                Error: "Invalid token was supplied - either missing or invalid"
                            });
                        }
                    });

                } else { 
                    callback(404, {
                        Error: 'Check was not found'
                    });
                }
            });
        } else{
            callback(400, {
                Error: 'You did not provide any data for check update'
            });
        }
    } else {

        callback(400, {
            Error: 'Invalid or missing check id was provided'
        });
    }

}

/**
 * DELETE /checks
 * 
 * Required data:
 * - id
 * 
 * Optional data: none
 * 
 */
handlers._checks.delete = function(data, callback) {

     // Check that the phone number is valid
     var id = 
        typeof data.queryStringObject.id == 'string' && 
         data.queryStringObject.id.trim().length === 20
            ? data.queryStringObject.id.trim()
            : false;

    if (id) {
        // Load the check
        _data.read('checks', id, function(err, check_data){
            if ( ! err) {
                var token = typeof data.headers.token == 'string' 
                    ? data.headers.token 
                    : false;
                // Validate that given token from the headers is valid for the phone number
                handlers._tokens.verify_token(token, check_data.user_phone, function(is_valid_token){
                    if (is_valid_token) {
                        // Get the user
                        
                       // Delete the check
                        _data.delete('checks', id, function(err) {
                            if ( ! err) {
                                
                                _data.read('users', check_data.user_phone, function(err, user_data){

                                    if ( ! err && user_data) {

                                         // Get existing users checks
                                        var user_checks = typeof(user_data.checks) == 'object' && user_data.checks instanceof Array
                                                ?  user_data.checks
                                                : [],
                                            check_position = user_checks.indexOf(id);

                                        // Delete the check if exists 
                                        if (check_position > -1) {

                                            // update the user checks
                                            user_checks.splice(check_position);
                                            user_data.checks = user_checks;
                                            _data.update('users', user_data.phone, user_data, function(err){
                                                if ( ! err) {
                                                    callback(200, {
                                                        Success: 'Check was removed successfully!'

                                                    });
                                                } else {
                                                    // This scenario should not happen
                                                    callback(500, {
                                                        Error: 'Could not update the user after check was removed'
                                                    });
                                                }
                                            });
                                        } else {
                                            // This scenario should not happen
                                            callback(500, {
                                                Error: 'User check was not found in the user data'
                                            });
                                        }
                                    } else {
                                        callback(500, {
                                            Error: 'Check was not removed from user - Could not find the user'
                                        }); 
                                    }

                                });

                            } else {
                                callback(500, {
                                    Error: 'Could not delete the check'
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            Error: "Invalid token was supplied - either missing or invalid"
                        });
                    }
                });
            } else {
                callback(404, {
                    Error: 'Check was not found'
                });
            }
        });

    } else {
        callback(400, {
            Error: 'Pleas provide a valid check id'
        });
    }
}


/*********************** Additional Services ******************************/
/**
 * 
 * @param {JSON} data 
 * @param {function} callback
 */

handlers.notFound = function(data, callback) {
    callback(404, {Error: "Route was not found in this app"});
};

/**
 * Simple route for ping tests
 * 
 * @param {JSON} data 
 * @param {function} callback 
 */
handlers.ping = function(data, callback) {
    callback(200);
};


// Export the handlers
module.exports = handlers;