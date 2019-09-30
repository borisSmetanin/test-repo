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

// Module for handling the operation system 
const os = require('os');

// Module for communicating with the V8 engine
const v8 = require('v8');

const _data = require('./data');
const _logs = require('./logs');

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

    const commands = {
        'exit': 'Kill the CLI (and the rest of the application)',
        'man': 'Show this help page',
        'help': 'Alias of the man command',
        'stats': 'Get statistics on the underlying operating system and resource utilization',
        'list users': 'Show a list of all the registered (undeleted) users in the system',
        'more user info --{userId}': 'Show details of a specific user',
        'list checks --up --down': 'show a list of all the active checks in the system including their state. The "--up" and the "--down" flags are both optional',
        'more check info --{checkId}': 'Show details of a specific check',
        'list logs': 'Show a list of all the log files available in the system to be read (compressed only)',
        'more log info --{filename}': 'Show details of specified log files'
    };

    // Show a header for the help that is as wide as the screen
    cli.horizontal_line();
    cli.centered('CLI MANUAL');
    cli.horizontal_line();
    cli.vertical_space(2);

    // Show each command with its explanation followed by white and yellow respectively

    for (const key in commands) {
        if (commands.hasOwnProperty(key)) {
            const value = commands[key];
            let line = `\x1b[33m${key}\x1b[0m`;
            const padding = 60 - line.length;

            for (let i = 0; i < padding; i++) {
                line+=' ';
            }

            line += value;
            console.log(line);
            cli.vertical_space();  
        }
    }

    cli.vertical_space();
    cli.horizontal_line();


}
cli.horizontal_line = () => {

    // Get the available screen size
    const width = process.stdout.columns
    let line    = '';

    for (let i = 0; i< width; i++) {
        line+='-';
    }

    console.log(line);
}

cli.centered = (string) => {

    string = typeof string === 'string' && string.trim().length > 0
        ? string.trim()
        : '';

    // Get the available screen size
    const width = process.stdout.columns

    // Calculate the left padding

    const left_padding = Math.floor((width - string.length) / 2);

    // put in left padding spaces before the string itself
    let line = '';

    for (let i = 0; i < left_padding; i++) {
        line+=' ';
    }
    line+=string;

    console.log(line);
}

cli.vertical_space = (lines) => {
    lines = typeof lines === 'number' && lines > 0
        ? lines 
        : 1;

    for (let i = 0; i< lines; i++) {
       console.log(''); 
    }

    
}

// Exit
cli.responders.exit = () => {
   process.exit(0) ;
}
// Stats
cli.responders.stats = () => {
    // Compile an object of stats
    const v8_heap_statistics = v8.getHeapStatistics();
    const stats = {
        'Load Average' : os.loadavg().join(' '),
        // It will tel us how many CPU are in the system
        'CPU count': os.cpus().length,
        'Free Memory': os.freemem(),
        'Current Malloced Memory' : v8_heap_statistics.malloced_memory,
        'Peak Malloced Memory' : v8_heap_statistics.peak_malloced_memory,
        'Allocated Heap Used (%)' : Math.round( (v8_heap_statistics.used_heap_size / v8_heap_statistics.total_heap_size) * 100),
        'Available Heap Allocated (%)': Math.round( (v8_heap_statistics.total_heap_size / v8_heap_statistics.heap_size_limit) * 100),
        'Uptime': `${os.uptime()} Seconds`
    }

    // Create a header for the stats
    cli.horizontal_line();
    cli.centered('SYSTEM STATISTICS');
    cli.horizontal_line();
    cli.vertical_space(2);


    for (const key in stats) {
        if (stats.hasOwnProperty(key)) {
            const value = stats[key];
            let line = `\x1b[33m${key}\x1b[0m`;
            const padding = 60 - line.length;

            for (let i = 0; i < padding; i++) {
                line+=' ';
            }

            line += value;
            console.log(line);
            cli.vertical_space();  
        }
    }

    cli.vertical_space();
    cli.horizontal_line();
}

// Lis Users
cli.responders.list_users = () => {
 
    _data.list('users', (err, user_ids) => {

        if ( ! err && user_ids && user_ids.length > 0) {
            // Create a header for the stats
            cli.vertical_space();
            user_ids.forEach(user_id => {
                _data.read('users', user_id, (err, user_data) => {

                    if ( ! err && user_data) {

                        let line               = `Name: ${user_data.firstName} ${user_data.lastName} || Phone: ${user_data.phone} || Checks: `;
                        const number_of_checks = 
                            typeof user_data.checks === 'object' && 
                            user_data.checks instanceof Array && 
                            user_data.checks.length > 0 
                                ? user_data.checks.length
                                : 0;
                        
                        line+=number_of_checks;

                        console.log(line);

                        cli.vertical_space();
                        
                    }
                });
            });
        } else {
            console.log('err', err);
        }
    });
    
}

// More user info
cli.responders.more_user_info = (string) => {
    // Get the ID from the string that was provided
    const arr     = string.split('--');
    const user_id = typeof arr[1] === 'string' && arr[1].trim().length > 0 
        ?  arr[1].trim()
        : false;

    if (user_id) {
    
        _data.read('users', user_id, (err, user_data) => {

            if ( ! err && user_data) {
               // Removed the hashed password
                delete user_data.hashedPassword;
                cli.vertical_space();
                console.dir(user_data, {colors: true});
                cli.vertical_space();
            }
        });
    }
}

// List checks
cli.responders.list_checks = (str) => {
    _data.list('checks', (err, check_ids) => {
        if ( ! err && check_ids && check_ids.length > 0) {
            cli.vertical_space();
            check_ids.forEach((check_id) => {

                _data.read('checks', check_id, (err, check_data) => {

                    const include_check = false;
                    const lower_string  = str.toLowerCase();
                    // Get the state of thr check but default to down
                    const state = typeof check_data.state === 'string' 
                        ? check_data.state 
                        : 'down';
                    
                    // Get the state, default to unknown
                    const state_or_unknown = typeof check_data.state === 'string' 
                        ? check_data.state 
                        : 'unknown';
                    // If the user specified the state, or hasn't specified any state, include the current check accordingly
                    if (
                        // User specifically asked for --up / --down
                        lower_string.includes(`--${state}`) || 
                        // User did not asked fore anything specific, e.g did not used any flag at all
                        // TODO this condition can be simplified by just checking for the command
                        (
                            ! lower_string.includes(`--down`) 
                            && 
                            ! lower_string.includes(`--up`)
                        )
                    ) {

                        let line = `ID: ${check_data.id} ${check_data.method.toUpperCase()}  ${check_data.protocol}://${check_data.url} State: ${state_or_unknown}`;

                        console.log(line);
                        cli.vertical_space();
                    }
                });
            });
        }
    });
   const arr = str.split('--');
   const check_type = typeof arr[1] === 'string' && arr[1].trim().toLowerCase() === 'down' ? 'down' : 'up';
}

// More checks info
cli.responders.more_check_info = (string) => {
   // Get the ID from the string that was provided
   const arr     = string.split('--');
   const check_id = typeof arr[1] === 'string' && arr[1].trim().length > 0 
       ?  arr[1].trim()
       : false;

   if (check_id) {
   
       _data.read('checks', check_id, (err, check_data) => {

           if ( ! err && check_data) {
               cli.vertical_space();
               console.dir(check_data, {colors: true});
               cli.vertical_space();
           }
       });
   }
}
// List logs
cli.responders.list_logs = () => {
    
    _logs.list(true, (err, log_file_names) => {

        if ( ! err && log_file_names && log_file_names.length> 0) {

            cli.vertical_space();

            log_file_names.forEach((log_file_name) => {

                if (log_file_name.includes('-')) {
                   console.log(log_file_name);
                   cli.vertical_space();
                }
            });
        }
    });

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