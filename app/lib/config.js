/**
 *  Create and export configuration variables
 */

 // Container for all envirenments

 var envirenments = {};

 // Stating (default) env
 envirenments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashingSecret: 'thisIsASecret'
 };

// Production env
envirenments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashingSecret: 'thisIsASecret'
};

// Determand which one of ther env vars should be exported out - with -CMD argumant

var currentEnvirenment = typeof(process.env.NODE_ENV) === 'string' 
    ? process.env.NODE_ENV.toLowerCase()
    : '';

// Check if env exists in our env object -- default to stataging

var envirenmentToExport = envirenments.hasOwnProperty(currentEnvirenment)
    ? envirenments[currentEnvirenment]
    : envirenments.staging;

// Export the env module

module.exports = envirenmentToExport;
