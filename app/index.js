// Set dependencies (worker & server files)
var server = require('./lib/server');
var workers = require('./lib/workers');

// Declare the app
var app = {};

// Set up the initialization function
// This function will initialize the server and workers
app.init = function() {
    // Start the server
    server.init();
    // Start the workrs
   workers.init();
}

// Start the App by executing the function
app.init();
// Export the App - will be usfull for testing later opn
module.exports = app;