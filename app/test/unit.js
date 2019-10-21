/**
 * Unit tests
 */

// Dependencies

const helpers = require('./../lib/helpers');

// Library to write functions that asset that one thing should be equal to another thing
const assert = require('assert');

const logs                      = require('./../lib/logs');
const example_debugging_problem = require('./../lib/example_debugging_problem');

// holder for the unit tests

const unit = {};
/**
 * Assert that a get_a_number function returns a number
 * @param done {function} || callback function
 */
unit['helpers.get_a_number should return a number'] = (done) => {

    // Invoke the helpers.get_a_number function
    const val = helpers.get_a_number();

    // Assert (test) that val is 1
    assert.equal(typeof(val), 'number');

    done();
}


/**
 * Assert that a get_a_number function returns 1
 * @param done {function} || callback function
 */
unit['helpers.get_a_number should return 1'] = (done) => {

    // Invoke the helpers.get_a_number function
    const val = helpers.get_a_number();

    // Assert (test) that val is 1
    assert.equal(val, 1);

    done();
}


/**
 * Assert that a get_a_number function returns 2 (will fail)
 * @param done {function} || callback function
 */
unit['helpers.get_a_number should return 2'] = (done) => {

    // Invoke the helpers.get_a_number function
    const val = helpers.get_a_number();

    // Assert (test) that val is 1
    // FYI - If assertion will not evaluated to true - it will throw an error
    assert.equal(val, 2);

    done();
}

// logs.list should callback array and a false error

unit['logs.list should callback a false ans an array of log names'] = (done) => {

    logs.list(true, (err, log_file_names) => {

        assert.equal(err, false);
        // assert that variable is `truthy`
        assert.ok(log_file_names instanceof Array);
        assert.ok(log_file_names.length > 1);
        done();
    });
}

/**
 * Testing truncate 
 */
unit['logs.truncate should not throw if the log id does not exist. It should callback an error instead'] = (done) => {

    assert.doesNotThrow(()=> {

        logs.truncate('I do not exists', (err) => {
            assert.ok(err);
            done()
        });

    }, TypeError);
}


/**
 * example_debugging_problem.init should not throw (but it does!)
 */
unit['example_debugging_problem.init should not throw when called'] = (done) => {

    assert.doesNotThrow(()=> {

        example_debugging_problem.init();
        done();
    }, TypeError);
}


// Export the test to the runner
module.exports = unit;