/**
 * Test Runner
 */

 // Override the NODE_ENV variable

 process.env.NODE_ENV = 'testing';

// Application logic for the test runner

const _app = {};

_app.tests = {};

// Add on the unit tests
_app.tests.unit = require('./unit');
_app.tests.api = require('./api');




/**
 * Counts all the tests
 */
_app.count_tests = () => {

    let counter = 0;

    for (const key in _app.tests) {
        if ( ! _app.tests.hasOwnProperty(key)) {
            continue;
        }

        const sub_test =  _app.tests[key];

        for (const test_name in sub_test) {
            if ( ! sub_test.hasOwnProperty(test_name)) {
                continue;
            }
            counter++;
        }
    }

    return counter;
}
/**
 * Function to run the tests, collecting the errors and successes
 */
_app.run_tests = () => {
    const errors    = [];
    let successes = 0
    const limit     = _app.count_tests();
    let counter   = 0;

    for (const key in _app.tests) {
        if ( ! _app.tests.hasOwnProperty(key)) {
            continue;
        }

        // e.g will contain all unit test and other test in the same level
        const sub_tests = _app.tests[key];

        // Loop inner sub-tests
        for (const test_name in sub_tests) {
            if ( ! sub_tests.hasOwnProperty(test_name)) {
                continue;
            }

            // Immediately executed function - this is needed to encapsulate the inner variables
            // IMO thins might not be needed in ES6 style of coding
            (() => {
                const temp_test_name = test_name;
                const test_value     = sub_tests[temp_test_name]

                // Call the test
                try {
                    test_value(() => {
                        // If it calls back without any error - the function has succeeded, s log it in green
                        console.log('\x1b[32m%s\x1b[0m', temp_test_name);
                        counter++;
                        successes++;

                        if (counter === limit) {
                            _app.produce_test_report(limit, successes, errors);
                        }
                    });
                } catch (e) {
                    // If it throws - then it failed, so capture the error thrown and log it in red
                    errors.push({
                        name: temp_test_name,
                        error: e
                    });

                    console.log('\x1b[31m%s\x1b[0m', temp_test_name);
                    counter++;

                    if (counter === limit) {
                        _app.produce_test_report(limit, successes, errors);
                    }
                }
            })();  
        }
    }
}

/**
 * Produces test report once the test is complete
 */
_app.produce_test_report = (limit, successes, errors) => {
    console.log('');
    console.log('-------------Begin Test Report----------------');
    console.log('');

    console.log('Total tests: ', limit);
    console.log('Pass: ', successes);
    console.log('Fails: ', errors.length);

    console.log('');

    // If there are errors, print them in detail
    if (errors.length > 0) {
        console.log('-------------Begin Error Details------------------');
        console.log('');
        errors.forEach(test_error => {
            console.log('\x1b[31m%s\x1b[0m',test_error.name);
            console.log(test_error.error);
            console.log('');
            
        });
        console.log('');
        console.log('-------------End Error Details---------------------');
    }

    console.log('');
    console.log('-------------End Test Report------------------');
    
    process.exit(0);
}


// Run the tests
_app.run_tests();
















