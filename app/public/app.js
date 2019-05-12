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


