/**
 * Request handlers
 */

 // Dependencies

 var _data = require('./data');
 var helpers = require('./helpers');
//  var config = require('./config');

// Define the request handlers
var handlers = {}

// New route for /users
// This funciton will figure out which method im useing and pass it to the correct handler
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

// Container for usrs sub-methods
handlers._users = {};

/**
 * POST /users
 * 
 * Requierd data:
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
    
    // Check all requierd field are filled out
    var firstName =
        typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0
        ? data.payload.firstName.trim()
        : false;

    var lastName =
        typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0
        ? data.payload.lastName.trim()
        : false;

    var phone =
        typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10
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

                    // Stor the user in our custome file system
                    _data.create('users', phone, userObject ,function(err){

                        if ( ! err) {

                            // No error - user was create sucssefully
                            callback(200, {
                                Sucsses: 'User was created sucssefully!'
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
                    Error: 'User already exists with thisn phone number'
                })
            }
        });
    } else {
        callback(400, {
            Error: 'Missing requiered fields' 
        });
    }
}

/**
 * GET /users
 * 
 * Requierd data:
 *  - phone
 * 
 * Optionl data: none
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
        data.queryStringObject.phone.trim().length === 10
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
            Error: 'Pleas provide a vaid phone number'
        });
    }
}

/**
 * PUT /users
 * 
 * Requierd data:
 *  - phone
 * 
 * Optionl data (at least one must be specified):
 * - firstName
 * - lastName
 * - password
 * 
 * @TODO let only authenticated users accsess to thier own data and nobody elses data
 * 
 * @param {Object} data 
 * @param {function} callback 
 */
handlers._users.put = function (data, callback) {
    // Check for the require fields
    var phone = 
        typeof data.payload.phone == 'string' && 
        data.payload.phone.trim().length === 10
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
                    // Get the user - check if user exists before we updste him
                    _data.read('users', phone, function(err, userData){
                        if ( ! err && userData) {
    
                            // Update the necessary fields
                            // @TODO i shouod do this part with a loop
    
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
                                        Sucsess: 'User was sucssefully updated'
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
            Error: 'Pleas provide a vaid phone number'
        });
    }

}

/**
 * DELETE /users
 * 
 * Requierd data:
 *  - phone
 * 
 * Optional data: none
 * 
 * @param {object} data 
 * @param {function} callback 
 * 
 * @TODO clean up (delete) any other files that might be related to this users
 * 
 */
handlers._users.delete = function (data, callback) {
     // Check that the phone number is valid

     var phone = 
     typeof data.queryStringObject.phone == 'string' && 
     data.queryStringObject.phone.trim().length === 10
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
           _data.read('users', phone, function (err, userData){
        
                if ( ! err) {
                    _data.delete('users', phone, function(err) {
                       if ( ! err) {
        
                           callback(200, {
                               Success: 'User was deleted successfully'
                           });
        
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
         Error: 'Pleas provide a vaid phone number'
     });
 }
}


// Container for Tokens methods
var _tokens = {};

// New handlers for tokens
// Handels all requests comming to /users
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
 * Requiered data:
 * - phone
 * - password
 * 
 * Optionsl data: none
 * 
 * @param data {object}
 * @param callback {function}
 */
handlers._tokens.post = function(data, callback) {

    var phone =
        typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10
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

                    // Hash the sent password and copmpare it to the existing password of the stored users
                    if (userData.hashedPassword && helpers.hash(password) == userData.hashedPassword) {

                        // Creat ne token with random name.
                        // Set experation date one hour in the future

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
 * Requiered data:
 * - id
 * 
 * Optionsl data: none
 * 
 */
handlers._tokens.get = function(data, callback) {
    // Check token id is valid
    var token_id = 
    typeof data.queryStringObject.id == 'string' && 
    // TODO this is bad practice: 20 should be kept as an constant so i can reus it
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
 * Requiered data:
 * - id
 * - extend
 * 
 *  Optionsl data: none
 */
handlers._tokens.put = function(data, callback) {
    
    // Get the token id

     // Check token id is valid
     var token_id = 
        typeof data.payload.id == 'string' && 
        // TODO this is bad practice: 20 should be kept as an constant so i can reus it
        data.payload.id.trim().length === 20
            ? data.payload.id.trim()
            : false;

    // TODO this is bad practice: 20 should be kept as an constant so i can reus it
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
           

    // extend the token for anothger 1 hour
    // TODO feels like extend= true is redundent
}

/**
 * DELETE /tokens
 * 
 * Requiered data:
 * - id
 * 
 */
handlers._tokens.delete = function(data, callback) {
     // Check token id is valid
     var token_id = 
        typeof data.payload.id == 'string' && 
        // TODO this is bad practice: 20 should be kept as an constant so i can reus it
        data.payload.id.trim().length === 20
            ? data.payload.id.trim()
            : false;

    if (token_id) {

        _data.read('tokens', token_id, function(err, token_data){
            if ( ! err) {
                _data.delete('tokens', token_id, function(err){
                    if ( ! err) {
                        callback(200, {
                            Sucsess: "token was sucsessfully deleted"
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

/**
 * 
 * @param {JSON} data 
 * @param {function} callback
 */

handlers.notFound = function(data, callback) {
    callback(404);
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