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

    console.log('data.method', data.method);
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

// POST /users
// Requierd data:
// * first name
//

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

    var tosAgreement =
        typeof(data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement == true
        ? true
        : false;

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
 * @TODO let only authenticated users accsess to thier own data
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

        // Get the user
        // TODO - im my app i will call it user and not data. data is generic and not clear
        _data.read('users', phone, function (err, data){

            if ( ! err) {
                // Remove the hashed password from the user object before return it to the caller
                delete data.hashedPassword;

                callback(200, data);
            } else {
                callback(404, {
                    Error: 'User was not found'
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

        // COntinue only if phone is valid

        if (firstName || lastName || password) {

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
 * @TODO let only authenticated users accsess to thier own data and nobody elses data
 * @TODO clean up any other files that might be related to this users
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
     callback(400, {
         Error: 'Pleas provide a vaid phone number'
     });
 }
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