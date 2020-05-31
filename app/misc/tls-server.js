/**
 * Example TLS server
 * Listens to port 6000 and sends the word pong to clients
 */

	// Dependencies

const tls            = require('tls');
const fs             = require('fs');
const path           = require('path');

// Server options
const options = {
	key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
	cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

// Const create the server
const server = tls.createServer(options,(connection) => {
	const outbound_message = 'pong';

	connection.write(outbound_message);

	// When the clint write something - log it out
	connection.on('data', (inbound_message) => {

		const message_string = inbound_message.toString();

		console.log(`i wrote ${outbound_message} and they said ${message_string}`);

	});

});

server.listen(6000);