// Set dependencies (worker & server files)
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var example_debugging_problem = require('./lib/example_debugging_problem');

// Declare the app
var app = {};

// Set up the initialization function
// This function will initialize the server and workers
app.init = function() {
    // Start the server
    debugger;
    server.init();

    debugger;

    // Start the workers
    // TODO -- dont want to start this since it creates a lot of unneeded logs
    debugger;
    workers.init();
    debugger;
    
    // FOr debug - un-comment this
    //app.sanity_check();
    
    // Starting the CLI - this should be done last after all other console outputs
    
    debugger;
    setTimeout(() => {
        
        cli.init();
    }, 50);
    debugger;
   
    debugger;
    var foo = 1;
    console.log('just assigned 1 to foo');
    debugger;

    foo++;
    console.log('just incremented foo');
    debugger;

    foo = foo * foo;
    console.log('just squared foo');
    debugger;

    // convert foo to a string

    foo = foo.toString();
    console.log('just converted foo to string');
    debugger;


    // call the init - Will create an error
    example_debugging_problem.init();
    console.log('just called the library');
    debugger;
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

// Start the App by executing the function
app.init();

//app.sanity_check();
// Export the App - will be usefully for testing later opn
module.exports = app;