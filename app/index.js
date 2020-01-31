// Set dependencies (worker & server files)
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');

var helpers = require('./lib/helpers');

// Declare the app
var app = {};

// Set up the initialization function
// This function will initialize the server and workers
app.init = (callback) => {
    // Start the server
    server.init();
    // Start the workers
    // TODO -- dont want to start this since it creates a lot of unneeded logs
     workers.init();
   
   // FOr debug - un-comment this
   //app.sanity_check();

   // Starting the CLI - this should be done last after all other console outputs

   setTimeout(() => {

    cli.init();

    if (typeof callback === 'function') {
        callback();
    }
   }, 50);
}

// Simple server to check that node is OK in my localhost
app.sanity_check = () => {
    let http = require('http');
    let hostname = '127.0.0.1';
    let port = 3000;

    let server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World\n');
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

// Self invoking only required directly
if (require.main === module) {
    // console.log('password', helpers.hash('ilovelinux'));
    app.init(function(){});
}
//app.sanity_check();
// Export the App - will be usefully for testing later opn
module.exports = app;