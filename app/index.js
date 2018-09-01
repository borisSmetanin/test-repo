//*** Loade dependencies ***//

/**
 * This is it
 * @type {[type]}
 */

var http = require('http');

// URL NODE module
var url = require('url');

// StringDecoder library

var StringDecoder = require('string_decoder').StringDecoder;

//*** Configure the APP **//

// The server shouold respond to all requests with a string (building RESTfull API)
var server = http.createServer(function(req, res){
    // Get the URL from the request and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the URL path
    var path        = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryString = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toUpperCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get the user's requested payload
    var decoder = new StringDecoder('utf-8');

    // This is the place holder for the decoded string
    var buffer = '';

    // Each and every time data is been decoded - (each string at a time)
    // This is appending the decoded string to the buffer variable
    // Data is been streemed one peace at a time
    req.on('data', function(data) {
        buffer+= decoder.write(data);
    });

    // Event triggered after buffer is done
    // No we can handel the procced data
    req.on('end', function() {
        // Append the rest of whats left of the decoding action to the buffer
        buffer+= decoder.end();

        // Choose the handler where this request should go to
        // when handler is not found - use the not found handler

        var chooseHnandler = typeof(router[trimmedPath]) !== 'undefined'
            ? router[trimmedPath]
            : handlers.notFound;

        // Construnct data obj to send to the handler

        var data = {
            trimmedPath: trimmedPath,
            queryString: queryString,
            method:method,
            headers: headers,
            payload: buffer
        };

        // route the request to handler specified in the rpouter

        chooseHnandler(data, function (statusCode, payload){

            // use status code that was called back by the handler or default to 200
            if (typeof(statusCode) != 'number') {
                statusCode = 200;
            }

            // Use the payload called back by the handel or default to empty object
            if (typeof(payload) != 'object') {
                payload = {};
            }

            // Convert payload payload to string for the respons to the user
            var paylaodString = JSON.stringify(payload);


            // Set response code

            res.setHeader('Content-Type', 'application/json');
            // writeHead - build in response code of the server module
            res.writeHead(statusCode);

            // Return the rsponse
            // Set the response that the users will see
            res.end(paylaodString);

            console.log('returned rsponse code: ',    statusCode    );
            console.log('returned rsponse payload: ', paylaodString );
            console.log('....');
        });

        // Log the requests each user has made - this is seen internally
       // console.log('Request recived "' + method +' ' + trimmedPath + '"');
        //console.log('queryString: ', queryString);
        //console.log('headers: ', headers);

        // console.log('Request payload: "' + buffer + '"');
        // console.log('....');
    });
});

//*** Run the App **//
// Start the server and have it listen to a specific port : 3000
server.listen(3000, function(){
    console.log('Server is listening on port 3000');
});

// Desine the request handlers
var handlers = {}

/**
 * Whet to do when user requests to see /sample route
 * 
 * @param {JSON} data 
 * @param {function} callback 
 */
handlers.sample = function(data, callback) {

    // Callback the HTTP status code (200 OK, 412..) and a paylaod object
    callback(406, { name: "sample handeler"});
};

/**
 * 
 * @param {JSON} data 
 * @param {function} callback
 */

handlers.notFound = function(data, callback) {
    callback(404);
};

// Define a request router
var router = {
    sample: handlers.sample,
};
