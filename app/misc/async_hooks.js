/**
 * Async Hooks Example
 */

// Dependencies

const async_hooks = require('async_hooks');
const fs          = require('fs');

const target_execution_context = false;

/**
 *
 * @param {function} callback
 */
const what_time_is_is = (callback) => {

	setInterval(() => {
		fs.writeSync(1, `When the setInterval runs the execution context is ${async_hooks.executionAsyncId()}\n`);
		callback(Date.now());
	}, 1000);
};

what_time_is_is((time) => {

	fs.writeSync(1, `The time is is: ${time}\n`);
});

const hooks = {

	init(async_id, type, trigger_async_id, resource) {

		fs.writeSync(1, `Hook init ${async_id}\n`);
	},

	before(async_id) {
		fs.writeSync(1, `Hook before ${async_id}\n`);
	},

	after(async_id) {
		fs.writeSync(1, `Hook after ${async_id}\n`);
	},

	destroy(async_id) {
		fs.writeSync(1, `Hook destroy ${async_id}\n`);
	},

	promiseResolve(async_id) {
		fs.writeSync(1, `Hook promiseResolve ${async_id}\n`);
	}
};

const async_hook = async_hooks.createHook(hooks);
async_hook.enable();




