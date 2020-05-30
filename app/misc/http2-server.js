// Example HTTP2

// Dependencies

const http2 = require('http2');

// init the server

const server = http2.createServer();

// On a stream - Send back hello world HTML

server.on('stream', (stream, headers) => {
	stream.respond({
		'status': 200,
		'content-type': 'text/html'
	});

	stream.end(`
			<html lang="en">
				<body>
					<p>Hello World</p>
				</body>
			</html>
	`);
});


// Listen on 6000
server.listen(6000);