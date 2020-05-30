/**
 * Example UDP client
 *
 * Sending a message on udp server on port 6000
 *
 */


// Dependencies
const dgram = require('dgram');

// Create the client
const client = dgram.createSocket('udp4');


// Define the message and pulling it in to a buffer
const message_string = 'This is a message';

const message_buffer = Buffer.from(message_string);

// Send of the message

client.send(message_buffer, 6000, 'localhost', (err) => {
	client.close();
});



