/**
 * ***********************
 * Server related tasks **
 * ***********************
 */

/**
 * Load depoendencies
 */

// Servers modules
var http = require('http');
var https = require('https');

//*** Exteranl helper modules ***/

// File system module
var fs = require('fs');
// URL NODE module
var url = require('url');
// StringDecoder library
var StringDecoder = require('string_decoder').StringDecoder;
// Path module
var path = require('path');

//** My own custom build modules **//
var config = require('./config');
var handlers = require('./handlers');
var helpers = require('./helpers');

/**
 * Configure and run the HTTP Server
 */

// Instantiate the server server module object (so we can export it)
var server = {};

// The server shouold respond to all requests with a string (building RESTfull API)
// Initisalizing the HTTP server
server.httpServer = http.createServer(function(req, res){
   server.unifiedServer(req, res);
});


//*** Configure and run the HTTPS Server **//
 server.httpsServerOptipons = {
    key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

// Config the HTTPS server
// The HTTPS server requier key and certificat in order to work so i need to pass it to this sever
server.httpsServer = https.createServer(server.httpsServerOptipons, function(req, res){
    server.unifiedServer(req, res);
 });


// Handels all server logic for HTTP and HTTPS servers
server.unifiedServer = function (req,res) {

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
     // Now we can handel the procced data
     req.on('end', function() {
         // Append the rest of whats left of the decoding action to the buffer
         buffer+= decoder.end();
 
         // Choose the handler where this request should go to
         // when handler is not found - use the not found handler
 
         var chooseHnandler = typeof(server.router[trimmedPath]) !== 'undefined'
             ? server.router[trimmedPath]
             : handlers.notFound;
 
         // Construnct data obj to send to the handler
 
         var data = {
             trimmedPath: trimmedPath,
             queryStringObject: queryString,
             method:method.toLowerCase(),
             headers: headers,
             payload: helpers.paresJsonToObject(buffer)
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
};

// Define a request router
server.router = {
    sample: handlers.sample,
    ping: handlers.ping,
    users: handlers.users,
    tokens: handlers.tokens,
    checks: handlers.checks
};
/**
 * Create the init function (which will initialize the server) 
 */

 server.init = function() {
     // Start the server and have it listen to a specific port : 3000
     server.httpServer.listen(config.httpPort, function(){
        console.log('HTTP type: HTTP');
        console.log('Environment ' + config.envName);
        console.log('Server is listening on port ' + config.httpPort);
        console.log('........');
    });

    // Start the HTTPS server
    server.httpsServer.listen(config.httpsPort, function(){
        console.log('HTTP type: HTTPS')
        console.log('Environment ' + config.envName);
        console.log('Server is listening on port ' + config.httpsPort);
        console.log('........');
    });
 }

/**
 * Export the server
 */
module.exports = server; 
