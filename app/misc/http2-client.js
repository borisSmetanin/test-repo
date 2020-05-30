/*
* Example HTTP2 client
*
*/

// Dependencies
const http2 = require('http2');

// Create a client
const client = http2.connect('http://localhost:6000');

// Creat a request
const req = client.request({
	':path': '/',

});

// When request is received add the pieces of it together until you reach the end
let str = '';
req.on('data', (chunck) => {
	str+=chunck;
});

// when the message ends - log it out
req.on('end', () => {
	console.log(str);
});

// End the request
req.end();

