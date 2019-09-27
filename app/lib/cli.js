/**
 * CLI-Related Tasks
 */

// Dependencies
const readline = require('readline');
const util     = require('util');
// Special logging utility
// e.g debugging will be visible to the user only if they start the app with `node debug=cli index.js`
const debug    = util.debuglog('cli');
const events = require('events');

// This is the recommended way of working with the events class- best is to extended it
class _events extends events {};

const e = new _events();


const cli = {};

// Process user's input
cli.process_input = (str) => {

    // Sanitize the input string
    str = typeof str === 'string' && str.trim().length > 0 
        ? str.trim() 
        : false;

    // Continue only if there is a string
    if (str) {
        // Codify the unique string tha identify the unique questions allowed to be asked
        const unique_inputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];
        // Go through possible inputs and emit an event when a match is found

        let match_found = false;
        let counter     = 0;

        unique_inputs.some((input) => {
            if (str.toLowerCase().indexOf(input) > -1) {

                match_found = true;

                // emit an event matching the unique input, and include the full string given by the user
                // This will trigger the event?
                e.emit(input, str);
                return true;
            }
        });

        // No match found
        if ( ! match_found) {
            console.log('Sorry, try again');
        }
    }  
}

// Initialize the CLI
cli.init = () => {

    // Send start message to the console. in dark blue
    console.log(`\x1b[34m%s\x1b[0m`,`The CLI is running`);

    // Start the interface
    const _interface = readline.createInterface({
        // This will tell Node that the input should come from the console / CLI users is using
        // stdin is "standard input"
        input: process.stdin,
        // stdout is "standard output"
        output: process.stdout,
        // This is the message for the user - e.g what the machine/CLI will output for him initially
        prompt: '>'
    });

    // Create an initial promp
    _interface.prompt();

    // handel each line of input separately

    _interface.on('line', (str) => {

        // Send the input line to the input processor
        cli.process_input(str);
        // Re-Initialize the prompt afterwards
        _interface.prompt();
    });

    // If the user stops the CLI, Kill the associated process
    _interface.on('close', () => {

        // The 0 is the status code we exit on
        // 0 == everything is fine
        process.exit(0);
    });






}

module.exports = cli;