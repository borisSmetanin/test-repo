/***********************************************
 * 
 * A library for storing and rotating logs
 * 
 * *********************************************
 */

/**
 * Load dependencies
 */

// Node modules
var 
    fs   = require('fs'),
    path = require('path'),
    zlib = require('zlib');

// Define the logs container
// @TODO - he calls it a lib but i think a better name would ba logs...
var lib = {};

// Base directory of logs folder
lib.base_dir = path.join(__dirname,'/../.logs/');

/**
 * Append a string to a file, create the file if it does not exists
 */
lib.append = (file, str, callback) => {

    fs.open(`${lib.base_dir}${file}.log`, 'a', (err, file_descriptor) => {

        if (! err && file_descriptor) {

            // Append to the file and close it
            fs.appendFile(file_descriptor, str + '\n', (err) => {
                if ( ! err) {
                    fs.close(file_descriptor, (err) => {

                        if ( ! err) {
                            callback(false);
                        } else {
                            callback('Error closing the file');
                        }
                    });
                } else {
                    callback('Error appending the file');        
                }
            });


        } else {
            callback('Could not open a file for appending');
        }
    });

}

/**
 * Lists all logs with an optional compressed log file
 * @param {boolean} include_compressed_logs 
 * @param {Function} callback 
 */
lib.list = (include_compressed_logs, callback) => {

    fs.readdir(lib.base_dir, (err, data) => {

        if ( ! err && data && data.length  > 0) {

            let trimmed_file_names = [];
            data.forEach((file_name) => {
                // Add the log files

                if (file_name.indexOf('.log') >-1) {
                    
                    trimmed_file_names.push(file_name.replace('.log', ''));
                }

                // Add the .gz (compressed file)
                if (include_compressed_logs  && file_name.indexOf('.gz.b64')) {
                    trimmed_file_names.push(file_name.replace('.gz.b64', ''));
                }
            });

            callback(false, trimmed_file_names);
        } else {
            callback(err, data);
        }
    });
}

/**
 * Compress a log file into a .gz.64 compressed file (within the same directory)
 * 
 * @param {string} log_id 
 * @param {string} new_file_id 
 */
lib.compress = (log_id, new_file_id, callback) => {
    let 
        source_file      = log_id + '.log',
        destination_file = new_file_id + '.gz.bs64';

        // Read the source file
    fs.readFile(lib.base_dir + '/' + source_file, 'utf8' ,(err, input_string) => {

        if ( ! err && input_string) {

            zlib.gzip(input_string, (err, buffer) => {


                if ( ! err && buffer) {

                    // Send the data to the destination file
                    fs.open(lib.base_dir + destination_file, 'wx', (err,  file_descriptor) => {
                        
                        if ( ! err && file_descriptor) {
                            // Write to the destination file
                            fs.writeFile(file_descriptor, buffer.toString('base64'), (err) => {
                                if ( ! err) {
                                    // Close the destination file
                                    fs.close(file_descriptor, (err) => {

                                        if ( ! err) {
                                            callback(false);

                                        } else {
                                            callback(err); 
                                        }
                                    });

                                } else {
                                    callback(err);        
                                }
                            });
                        } else {
                            callback(true, {
                                err: err,
                                file_descriptor: file_descriptor
                            });
                        }
                    });
                } else {
                    callback(true, {
                        err: err,
                        buffer: buffer
                    });
                }
            });
        } else {
            callback(true, {
                input_string: input_string,
                err: err
            });
        }
    });
}

/**
 * Decompress the content of .gz.b64 file into a string
 * 
 * @param {string}   file_id 
 * @param {function} callback 
 */
lib.de_compress = (file_id, callback) => {
    
    fs.readFile(lib.base_dir + file_id + '.gz.b64', 'utf8', (err, str) => {

        if ( ! err && string) {
            // Decompress the data and return it in the callback
            let input_buffer = Buffer.from(str, 'base64');
            zlib.unzip(input_buffer, (err, output_buffer) => {

                if ( ! err && output_buffer) {

                    callback(false, output_buffer.toString());
                } else {
                    callback('Decompress: can not unzip ', {
                        err: err,
                        output_buffer: output_buffer
                    })
                }
            });

        } else {
            callback('Decompress: can not open a file log file ', {
                err: err,
                string: string
            });
        }
    });
    
}

/**
 * Truncate a log file
 * 
 * @param {string}   log_id 
 * @param {function} callback 
 */
lib.truncate = (log_id, callback) => {

    fs.truncate(lib.base_dir + log_id + '.log', 0,(err) => {
        if ( ! err) {
            callback(false);
        } else {
            callback('Truncate: failed to truncate a file', {
                err: err
            });
        }
    });
}

module.exports = lib;