/**
 * This is the front end logic of the app
 */


// Container for front - end app
 const app = {};

 app.config = {
     session_token: false
 }

// Ajax client for REST-full API
app.client = {};

// Interface for making API calls

app.client.request = (headers, path, method, query_string_object, payload, callback) => {

    // Setting defaults
    headers = typeof(headers) == 'object' && headers !== null 
        ? headers 
        : {};

    path = typeof(path) == 'string' 
        ? path 
        : '/';
    
    method = typeof(method) == 'string' && ['GET', 'POST', 'PUT', 'DELETE'].includes(method.toUpperCase())
        ? method.toUpperCase() 
        : 'GET';
    
    query_string_object = typeof(query_string_object) == 'object' && query_string_object !== null 
        ? query_string_object 
        : {};

    payload = typeof(payload) == 'object' && payload !== null 
        ? payload 
        : {};

    callback = typeof(callback) == 'function'
        ? callback
        : false;

    // For each query string parameter set - add it to the path
    let 
        query_string_pairs = Object.entries(query_string_object).map(
            ([query_key, query_value]) => `${encodeURIComponent(query_key)}=${encodeURIComponent(query_value)}`
        ),
        request_url = `${path}?${query_string_pairs.join('&')}`;

    // Form the HTTP request as a JSON type
    const xhr = new XMLHttpRequest();

    // Initialize the request
    xhr.open(method, request_url, true);

    // Set headers
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Loop on the request in order to create the headers
    Object.entries(headers).forEach(([header_key, header_value]) => {
        xhr.setRequestHeader(header_key, header_value);
    });

    // If there is a session token - add this token as a header as well
    if (app.config.session_token) {
        xhr.setRequestHeader('token', app.config.session_token.id);
    }

    // When request comes back - handel the response
    xhr.onreadystatechange = () => {

        if (xhr.readyState == XMLHttpRequest.DONE) {
            let 
                status_code       = xhr.status,
                response_returned = xhr.responseText;

            // Callback if requested
            if (callback) {

                // Nest it inside try-catch in case json parsing is failing
                try {
                    callback(status_code, JSON.parse(response_returned));
                } catch (e) {
                    callback(status_code, false);
                }
            }
        }

    }
    // Send the payload as JSON string
    xhr.send(JSON.stringify(payload));
}

// Bind the logout button
app.bindLogoutButton = function(){
  document.getElementById("logoutButton").addEventListener("click", function(e){

    // Stop it from redirecting anywhere
    e.preventDefault();

    // Log the user out
    app.logUserOut();

  });
};

// Log the user out then redirect them
app.logUserOut = function(){
  // Get the current token id
  var tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

  // Send the current token to the tokens endpoint to delete it
  var queryStringObject = {
    'id' : tokenId
  };
  app.client.request(undefined,'api/tokens','DELETE',queryStringObject,undefined,function(statusCode,responsePayload){
    // Set the app.config token as false
    app.setSessionToken(false);

    // Send the user to the logged out page
    window.location = '/session/deleted';

  });
};

// Bind the forms
app.bindForms = function(){
  if(document.querySelector("form")){
    document.querySelector("form").addEventListener("submit", function(e){

      // Stop it from submitting
      e.preventDefault();
      var formId = this.id;
      var path = this.action;
      var method = this.method.toUpperCase();

      // Hide the error message (if it's currently shown due to a previous error)
      document.querySelector("#"+formId+" .formError").style.display = 'hidden';

      // Turn the inputs into a payload
      var payload = {};
      var elements = this.elements;
      for(var i = 0; i < elements.length; i++){
        if(elements[i].type !== 'submit'){
          var valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
          payload[elements[i].name] = valueOfElement;
        }
      }

      // Call the API
      app.client.request(undefined,path,method,undefined,payload,function(statusCode,responsePayload){
        // Display an error on the form if needed
        if(statusCode !== 200){

          if(statusCode == 403){
            // log the user out
            app.logUserOut();
            
          } else {

            // Try to get the error from the api, or set a default error message
            var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

            // Set the formError field with the error text
            document.querySelector("#"+formId+" .formError").innerHTML = error;

            // Show (unhide) the form error field on the form
            document.querySelector("#"+formId+" .formError").style.display = 'block';
          }
        } else {
          // If successful, send to form response processor
          app.formResponseProcessor(formId,payload,responsePayload);
        }

      });
    });
  }
};

// Form response processor
app.formResponseProcessor = function(formId,requestPayload,responsePayload){
  var functionToCall = false;
  // If account creation was successful, try to immediately log the user in
  if(formId == 'accountCreate'){
    // Take the phone and password, and use it to log the user in
    var newPayload = {
      'phone' : requestPayload.phone,
      'password' : requestPayload.password
    };

    app.client.request(undefined,'api/tokens','POST',undefined,newPayload,function(newStatusCode,newResponsePayload){
      // Display an error on the form if needed
      if(newStatusCode !== 200){

        // Set the formError field with the error text
        document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

        // Show (unhide) the form error field on the form
        document.querySelector("#"+formId+" .formError").style.display = 'block';

      } else {
        // If successful, set the token and redirect the user
        app.setSessionToken(newResponsePayload);
        window.location = '/checks/all';
      }
    });
  }
  // If login was successful, set the token in localstorage and redirect the user
  if(formId == 'sessionCreate'){
    app.setSessionToken(responsePayload);
    window.location = '/checks/all';
  }
};

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function(){
  var tokenString = localStorage.getItem('token');
  if(typeof(tokenString) == 'string'){
    try{
      var token = JSON.parse(tokenString);
      app.config.sessionToken = token;
      if(typeof(token) == 'object'){
        app.setLoggedInClass(true);
      } else {
        app.setLoggedInClass(false);
      }
    }catch(e){
      app.config.sessionToken = false;
      app.setLoggedInClass(false);
    }
  }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function(add){
  var target = document.querySelector("body");
  if(add){
    target.classList.add('loggedIn');
  } else {
    target.classList.remove('loggedIn');
  }
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function(token){
  app.config.sessionToken = token;
  var tokenString = JSON.stringify(token);
  localStorage.setItem('token',tokenString);
  if(typeof(token) == 'object'){
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
};

// Renew the token
app.renewToken = function(callback){
  var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  if(currentToken){
    // Update the token with a new expiration
    var payload = {
      'id' : currentToken.id,
      'extend' : true,
    };
    app.client.request(undefined,'api/tokens','PUT',undefined,payload,function(statusCode,responsePayload){
      // Display an error on the form if needed
      if(statusCode == 200){
        // Get the new token details
        var queryStringObject = {'id' : currentToken.id};
        app.client.request(undefined,'api/tokens','GET',queryStringObject,undefined,function(statusCode,responsePayload){
          // Display an error on the form if needed
          if(statusCode == 200){
            app.setSessionToken(responsePayload);
            callback(false);
          } else {
            app.setSessionToken(false);
            callback(true);
          }
        });
      } else {
        app.setSessionToken(false);
        callback(true);
      }
    });
  } else {
    app.setSessionToken(false);
    callback(true);
  }
};

// Loop to renew token often
app.tokenRenewalLoop = function(){
  setInterval(function(){
    app.renewToken(function(err){
      if(!err){
        console.log("Token renewed successfully @ "+Date.now());
      }
    });
  },1000 * 60);
};

// Init (bootstrapping)
app.init = function(){

  // Bind all form submissions
  app.bindForms();

  // Bind logout logout button
  app.bindLogoutButton();

  // Get the token from localstorage
  app.getSessionToken();

  // Renew token
  app.tokenRenewalLoop();

};

// Call the init processes after the window loads
window.onload = function(){
  app.init();
};


