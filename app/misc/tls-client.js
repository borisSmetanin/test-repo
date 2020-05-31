/**
 * Example TLS client
 * connects to port 6000 and sends the word ping to servers
 */

	// Dependencies

const tls  = require('tls');
const fs   = require('fs');
const path = require('path');

const outbound_message = 'ping';

// Server options
const options = {
	ca: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')) // only requiered because we are using self-signed certificate
};

// Const create the server
const client = tls.connect(6000,options, () => {
	// send the message

	client.write(outbound_message);
});

// When the server writes back - log what it says, then kill the client

client.on('data', (inbound_message) => {
	const message_string = inbound_message.toString();

	console.log(`i wrote ${outbound_message} and they said ${message_string}`);
	client.end();
});


