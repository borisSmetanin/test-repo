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


//=== Input Handlers - will be bind to events (CLI Events) =============================/

e.on('man', (str) => {
    cli.responders.help();
})
e.on('help', (str) => {
    cli.responders.help();
}) 

e.on('exit', (str) => {
    cli.responders.exit();
})
e.on('stats', (str) => {
    cli.responders.stats();
})
e.on('list users', (str) => {
    cli.responders.list_users();
})
e.on('more user info', (str) => {
    cli.responders.more_user_info(str);
})
e.on('list checks', (str) => {
    cli.responders.list_checks(str);
})
e.on('more check info', (str) => {
    cli.responders.more_check_info(str);
})
e.on('list logs', (str) => {
    cli.responders.list_logs();
})
e.on('more log info', (str) => {
    cli.responders.more_log_info(str);
})

//=== Responders Objects (event handlers) ==============================================/
cli.responders = {};

// help / man
cli.responders.help = () => {
    console.log('You asked for help'); 
}

// Exit
cli.responders.exit = () => {
   process.exit(0) ;
}
// Stats
cli.responders.stats = () => {
    console.log('You asked for stats'); 
}

// Lis Users
cli.responders.list_users = () => {
    console.log('You asked for list users'); 
}

// More user info
cli.responders.more_user_info = (str) => {
    console.log('You asked for more user info', str); 
}

// List checks
cli.responders.list_checks = (str) => {
    console.log('You asked for list checks', str); 
}

// More checks info
cli.responders.more_check_info = (str) => {
    console.log('You asked for more check info', str); 
}
// List logs
cli.responders.list_logs = () => {
    console.log('You asked for list logs'); 
}

// More log info
cli.responders.more_log_info = (str) => {
    console.log('You asked for more log info', str); 
}


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