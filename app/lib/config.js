/**
 *  Create and export configuration variables
 */

 // Container for all envirenments

 var environments = {}

 // Stating (default) env
 environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashingSecret: 'thisIsASecret',
 };

// Production env
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashingSecret: 'thisIsASecret',
};



// Determent which one of ther env vars should be exported out - with -CMD argument

var currentEnvironment = typeof(process.env.NODE_ENV) === 'string' 
    ? process.env.NODE_ENV.toLowerCase()
    : '';

// Check if env exists in our env object -- default to stataging

var environmentToExport = environments.hasOwnProperty(currentEnvironment)
    ? environments[currentEnvironment]
    : environments.staging;

environmentToExport.maxChecks = 5;
environmentToExport.twilio = {
    from_phone: '+15005550006',
    accountsSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
    authToken: '9455e3eb3109edc12e3d8c92768f7a67'
};

// Export the env module

module.exports = environmentToExport;
