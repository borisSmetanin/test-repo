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

// Bind the forms
app.bindForms = function(){
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
  
          // Try to get the error from the api, or set a default error message
          var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';
  
          // Set the formError field with the error text
          document.querySelector("#"+formId+" .formError").innerHTML = error;
  
          // Show (unhide) the form error field on the form
          document.querySelector("#"+formId+" .formError").style.display = 'block';
  
        } else {
          // If successful, send to form response processor
          app.formResponseProcessor(formId,payload,responsePayload);
        }
  
      });
    });
  };
  
  // Form response processor
  app.formResponseProcessor = function(formId,requestPayload,responsePayload){
    var functionToCall = false;
    if(formId == 'accountCreate'){
      // @TODO Do something here now that the account has been created successfully
    }
  };
  
  // Init (bootstrapping)
  app.init = function(){
    // Bind all form submissions
    app.bindForms();
  };
  
  // Call the init processes after the window loads
  window.onload = function(){
    app.init();
  };


