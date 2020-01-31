// Set dependencies (worker & server files)
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');

// can creat multi processes - IMO can help with scaling up the APP
const cluster = require('cluster');
const os      = require('os');

// Declare the app
var app = {};

// Set up the initialization function
app.init = (callback) => {

    // If we are on the master thread - start the background workers and the CLI
    if (cluster.isMaster) {
        // Start the workers
        workers.init();

        // Starting the CLI - this should be done last after all other console outputs
        setTimeout(() => {
            cli.init();
            if (typeof callback === 'function') {
                callback();
            }
        }, 50);

        // For the Node processes
        for (let i = 0; i < os.cpus().length; i++) {
            cluster.fork();
        }

    } else {
        // If we are not on the master thread, Start the HTTP server
        server.init();
    }

}

// Self invoking only required directly
if (require.main === module) {
    // console.log('password', helpers.hash('ilovelinux'));
    app.init(function(){});
}
// Export the App - will be usefully for testing later opn
module.exports = app;