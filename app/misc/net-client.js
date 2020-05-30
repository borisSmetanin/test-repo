/**
 * Example TCP (Net) client
 * connects to port 6000 and sends the word ping to servers
 */

	// Dependencies

const net              = require('net');
const outbound_message = 'ping';

// Const create the server
const client = net.createConnection({ port: 6000}, () => {
	// send the message

	client.write(outbound_message);
});

// When the server writes back - log what it says, then kill the client

client.on('data', (inbound_message) => {
	const message_string = inbound_message.toString();

	console.log(`i worte ${outbound_message} and they said ${message_string}`);
	client.end();
});


