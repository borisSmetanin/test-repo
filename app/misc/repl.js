/**
 * Example REPL server
 *
 * Take the word "fizz" and log out "buzz"
 */

// Dependencies

const repl = require('repl');

// Start the REPL

repl.start({
	'prompt': '>',
	// Evaluation functions
	'eval': (str) => {

		console.log(`At the evaluation stage: ${str}`);

		if (str.includes('fizz')) {
			console.log('buzz')
		}
	}
});