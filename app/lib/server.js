/**
 * ***********************
 * Server related tasks **
 * ***********************
 */

/**
 * Load dependencies
 */

// Servers modules
var http = require('http');
var https = require('https');

//*** External helper modules ***/

// File system module
var fs = require('fs');
// URL NODE module
var url = require('url');
// StringDecoder library
var StringDecoder = require('string_decoder').StringDecoder;
// Path module
var path = require('path');

var 
    util  = require('util'),
    debug = util.debuglog('server');

//** My own custom build modules **//
var config = require('./config');
var handlers = require('./handlers');
var helpers = require('./helpers');

/**
 * Configure and run the HTTP Server
 */

// Instantiate the server server module object (so we can export it)
var server = {};

// The server should respond to all requests with a string (building RESTfull API)
// Initializing the HTTP server
server.httpServer = http.createServer(function(req, res){
   server.unifiedServer(req, res);
});


//*** Configure and run the HTTPS Server **//
 server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

// Config the HTTPS server
// The HTTPS server require key and certificate in order to work so i need to pass it to this sever
server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res){
    server.unifiedServer(req, res);
 });


// Handles all server logic for HTTP and HTTPS servers
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
     // Data is been streamed one peace at a time
     req.on('data', function(data) {
         buffer+= decoder.write(data);
     });
 
     // Event triggered after buffer is done
     // Now we can handel the proceed data
     req.on('end', function() {
         // Append the rest of whats left of the decoding action to the buffer
         buffer+= decoder.end();
 
         // Choose the handler where this request should go to
         // when handler is not found - use the not found handler
 
         var chooseHandler = typeof(server.router[trimmedPath]) !== 'undefined'
             ? server.router[trimmedPath]
             : handlers.notFound;
 
         // Construct data obj to send to the handler
 
         var data = {
             trimmedPath: trimmedPath,
             queryStringObject: queryString,
             method:method.toLowerCase(),
             headers: headers,
             payload: helpers.paresJsonToObject(buffer)
         };
 
         // route the request to handler specified in the router
         chooseHandler(data, function (statusCode, payload, content_type){
 
            // Determined that the content type will default to json
            if ( typeof(content_type) != 'string') {
                content_type = 'json';
            }
             // use status code that was called back by the handler or default to 200
             if (typeof(statusCode) != 'number') {
                 statusCode = 200;
             }
 
             
             // Set response code
 
             // Return the response part that are content specific

             // Return the response parts that are common to all content-types
            
             let payloadString = '';
             if (content_type == 'json') {
                 
                 res.setHeader('Content-Type', 'application/json');
                // Use the payload called back by the handel or default to empty object
                if (typeof(payload) != 'object') {
                    payload = {};
                }

                // Convert payload payload to string for the response to the user
                payloadString = JSON.stringify(payload);
             }

             if (content_type =='html') {
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof(payload) == 'string' ? payload : '';

             }
             // writeHead - build in response code of the server module
             res.writeHead(statusCode);
             // Return the response
             // Set the response that the users will see
             res.end(payloadString);


             let console_color = statusCode === 200 
                ? `\x1b[32m%s\x1b[0m` 
                : `\x1b[31m%s\x1b[0m`; 
 
             debug(console_color, `returned response code: ${statusCode}`);
             debug(console_color, `HTTP Request: ${method.toUpperCase()} /${trimmedPath}`);
             debug('....');
         });
     });
};

// Define a request router
server.router = {
    // home page of the web app
    '': handlers.index,
    // Registration route
    'account/create':handlers.account_create,
    // Edit user route
    'account/edit': handlers.account_edit,
    // Page to show after account has been deleted
    'account/deleted': handlers.account_deleted,
    // the login form page
    'session/create': handlers.session_create,
    // Logout page (after users has been logged out)
    'session/deleted': handlers.session_deleted,
    // Route for showing the users checks
    'checks/all': handlers.check_list,
    'checks/create': handlers.check_create,
    // Page to show after check has been edited
    'checks/edit': handlers.check_edit,
    'sample': handlers.sample,
    'ping': handlers.ping,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/checks': handlers.checks
};

/**
 * Helper function fort displaying console messages
 * 
 * @param {string} http_type 
 */
 server.console_notifications = (http_type) => {

    let port, console_color;

    if (http_type === 'https') {
        port          = config.httpsPort;
        console_color = `\x1b[36m%s\x1b[0m`;
    } else {
        port          = config.httpPort;
        console_color = `\x1b[35m%s\x1b[0m`;
    }
    console.log(console_color,`HTTP type: ${http_type.toUpperCase()}`);
    console.log(console_color, `Environment ${config.envName}`);
    console.log(console_color, `Server is listening on port ${port}`);
    console.log('........');
 }

 /**
 * Create the init function (which will initialize the server) 
 */
 server.init = function() {
     // Start the server and have it listen to a specific port : 3000
     server.httpServer.listen(config.httpPort,'127.0.0.1', function(){
        server.console_notifications('http');
    });

    // Start the HTTPS server
    server.httpsServer.listen(config.httpsPort, '127.0.0.1', function(){
        server.console_notifications('https');
    });
 }

/**
 * Export the server
 */
module.exports = server; 
