/**
 * Tes API requests
 */


 // Dependencies

 const app    = require('./../index');
 const assert = require('assert');
 const http   = require('http');
 const config = require('./../lib/config');

 // API test container
 const api = {};
 const helpers = {};

 helpers.make_get_request = (path, callback) => {

    // Configure the details

    const request_details = {
        protocol: 'http:',
        hostname: 'localhost',
        port: config.httpPort,
        method: 'GET',
        path: path,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Send the request afterwards
    const req = http.request(request_details, (res) => {
        callback(res);
    });

    req.end();
 }

 // The main init function should be able to run without throwing
 api['app.init should start without throwing'] = (done) => {
     assert.doesNotThrow(()=> {

        app.init(()=>{
           done(); 
        });
     }, TypeError);
 }

 // Request to /ping
api['/ping should respond to GET with 200'] = (done) => {
    helpers.make_get_request('/ping', (res) => {
        assert.equal(res.statusCode, 200);
        done();
    });
}

// Request to api/users
api['/api/users should respond to GET with 400'] = (done) => {
    helpers.make_get_request('/api/users', (res) => {
        assert.equal(res.statusCode, 400);
        done();
    });
}

// Request to a random path
api['A random path should respond to GET with 404'] = (done) => {
    helpers.make_get_request('/this/path/should/not/exists', (res) => {
        assert.equal(res.statusCode, 404);
        done();
    });
}










// Export the test to the runner
 module.exports = api;