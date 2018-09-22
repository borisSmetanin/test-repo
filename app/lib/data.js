/**
 * Libray for storing and editing data
 */

 // File will have 2 dependencies

 // File System module
 var fs = require('fs');
 // Used to normalize the path to diffrent directories
 var path = require('path');

 var helpers = require('./helpers');

 // Create a continer for this module
 var lib = {};

// Creat a functioin for writing data into a file

// Base directory of data folder

lib.baseDir = path.join(__dirname,'/../.data/');
/**
 *  Create new file
 * 
 * This will act like a DB each directory is a table, each file is a row
 * 
 * @param {string} dir || the name of the requestsed directory
 * @param {string} fileName || the name of the file inside this directory
 * @param {Object} data 
 * @param {Function} callback
 */
lib.create = function (dir, fileName, data, callback) {

    // Try open the file for writing
    // Result will be "app/.data/fileName.json"
    fs.open(
        // Path of the file
        lib.baseDir + dir + '/' + fileName + '.json', 
        //Execution type (wx == writing)
        'wx',
        // Callback
        // fileDescriptor a way to uniqly identify the file, like a mysql id
        function (err, fileDescriptor) {
            
            if ( ! err && fileDescriptor) {
                // All is OK continue the logic
                // Convert data to string so we can insert it to the file
                var stringData = JSON.stringify(data);

                // Write data to file and close it

                fs.writeFile(fileDescriptor, stringData, function (err){
                    if ( ! err) {

                        // Closing the file when we finish writing to it
                        fs.close(fileDescriptor, function (err){
                            if ( ! err) {
                                // callback's first param is to see if there are any errors
                                callback(false);
                            } else {
                                callback('Error closing new file'); 
                            }
                        });
                    } else {
                        callback('Error writing to new file');
                    }
                });


            } else {

                // an error has accorded

                console.log('error', err);
                console.log('fileDescriptor', fileDescriptor);
                callback('Could not create new file it may already be exist');
            }

        }
    );
}


// Read data from a file

lib.read = function(dir, fileName, callback) {

    // Reads files
    fs.readFile(
        // Path to file
        lib.baseDir + dir + '/' + fileName + '.json',
        // Reading encoding
        'utf8',
        function (err, data) {

            // Pass err and data params back to the callback
            if ( ! err && data) {
                var parsed_data = helpers.paresJsonToObject(data);
                callback(false, parsed_data);
            } else {
                callback(err, data);
            }
        }

    );
};

// Update existing file
lib.update = function(dir, fileName, data, callback) {
    // Open the file for writing
    fs.open(
        // Path to file
        lib.baseDir + dir + '/' + fileName + '.json',
        // writing  + error out if file dosnt exist yet
        'r+',
        function (err, fileDescriptor) {
            if ( ! err && fileDescriptor) {
                // Continue logic
                var stringData = JSON.stringify(data);
                // Truncate the file before writing on top of it

                // For may app i should consider getting the data and merge existing data with new data
                // This way i can override

                // TODO i should consider implementing some sort of validatore
                // TODO maybe use ES6 proxy?
                fs.truncate(fileDescriptor, function(err){
                    if ( ! err) {
                        // Write to the file and close it

                        fs.writeFile(fileDescriptor, stringData, function(err){

                            if ( ! err) {
                                fs.close(fileDescriptor, function(err){
                                    if ( ! err) {
                                        callback(false);
                                    } else {
                                        callback('Error when closing the existing file');
                                    }
                                });
                            } else {

                                callback('error writing to exising file');
                            }
                        });
                    } else {
                        console.log('error', err);
                        callback('Error while truncating the file');
                    }
                });

            } else {
                // Error has accord

                console.log('err', err);
                console.log('fileDescriptor', fileDescriptor);
                callback('could not open the file for updating - it may not exist')
            }
        }
    );
};

// Delete single file
lib.delete = function(dir, fileName, callback) {

    // Unlink the file from file system
    fs.unlink(lib.baseDir + dir + '/' + fileName + '.json', function(err){
        if ( ! err) {
            callback(false);
        } else {
            callback('Error while deleteing the file');
        }
    });
}

// Export the module
 module.exports = lib;





