// Set dependencies (worker & server files)
var server = require('./lib/server');
var workers = require('./lib/workers');

// Declare the app
var app = {};

// Set up the initialization function
// This function will initialize the server and workers
app.init = function() {
    // Start the server
    //server.init();
//     var url = require('url');
//    var test = url.parse('http' + '://' + 'www.facebook.com/asasd/asdasc', true);

//    console.info('test');
//    console.info(test);
    //workers.gather_all_checks();

    // Start the workrs
    //workers.init();

}

// Start the App by executing the function
app.init();
// Export the App - will be usfull for testing later opn
module.exports = app;