/**
 * Library demonstrating something throwing when it's init() is called
 */

 const example = {};

 example.init = () => {

    // This is an error created intentionally (bar is not defined)
    var foo = bar;

 }

 module.exports = example;

