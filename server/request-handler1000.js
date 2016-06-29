var _ = require('underscore');
var url = require('url');
var messages = [];

var requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);
  var parsedUrl = url.parse(request.url); // /classes/name
  var pathName = parsedUrl.pathname;
  console.log(pathName);


  if(request.method === "GET" ){

    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";

    response.writeHead(statusCode, headers);
    response.end( JSON.stringify({ results:[] }) );

  } else if(request.method === "POST" ){
    var statusCode = 201;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";
    response.writeHead(statusCode, headers);

    var body = [];

    request.on('data', function(chunk){
      body.push(chunk);

    });

    request.on('end', function(){
      body = Buffer.concat(body).toString();
      messages.push( JSON.parse(body) );
      response.end(JSON.stringify(body));
      //response.end('posted');
    });

  } else if(request.method === "OPTIONS" ){
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";

    response.writeHead(statusCode, headers);
    response.end( 'options' );
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


module.exports.requestHandler = requestHandler;
module.exports.defaultCorsHeaders = defaultCorsHeaders;

