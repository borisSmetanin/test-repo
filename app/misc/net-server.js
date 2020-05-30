/**
 * Example TCP (Net) server
 * Listens to port 6000 and sends the word pong to clients
 */

// Dependencies

const net = require('net');

// Const create the server
const server = net.createServer((connection) => {
	const outbound_message = 'pong';

	connection.write(outbound_message);

	// When the clint write something - log it out
	connection.on('data', (inbound_message) => {

		const message_string = inbound_message.toString();

		console.log(`i worte ${outbound_message} and they said ${message_string}`);

	});

});

server.listen(6000);