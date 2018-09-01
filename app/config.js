/**
 *  Create and export configuration variables
 */

 // Container for all envirenments

 var envirenments = {};

 // Stating (default) env
 envirenments.stating = {
    port: 3000,
    envName: 'staging'
 };

// Production env
envirenments.production = {
    port: 5000,
    envName: 'production'
};

