/**
 *  Create and export configuration variables
 */

 // Container for all environments

 var environments = {}

 // Stating (default) env
 environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashingSecret: 'thisIsASecret',
 };

  // Testing env
  environments.staging = {
    httpPort: 4000,
    httpsPort: 4001,
    envName: 'testing',
    hashingSecret: 'thisIsASecret',
 };

// Production env
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashingSecret: 'thisIsASecret',
};



// Determent which one of their env vars should be exported out - with -CMD argument

var currentEnvironment = typeof(process.env.NODE_ENV) === 'string' 
    ? process.env.NODE_ENV.toLowerCase()
    : '';

// Check if env exists in our env object -- default to stating

var environmentToExport = environments.hasOwnProperty(currentEnvironment)
    ? environments[currentEnvironment]
    : environments.staging;

environmentToExport.maxChecks = 5;
environmentToExport.twilio = {
    from_phone: '+15005550006',
    accountsSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
    authToken: '9455e3eb3109edc12e3d8c92768f7a67'
};

environmentToExport.template_globals = {
    app_name: 'UptimeChecker',
    company_name: 'NotRealComp, inc',
    year_created: '2018',
    base_url: environmentToExport.envName == 'production'
     ? 'http://localhost:5000'
     : 'http://localhost:3000'
}



// Export the env module

module.exports = environmentToExport;
