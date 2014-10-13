var http = require("http");
var url = require("url");
var querystring = require("querystring");

// private methods
function processPost(request, response, callback)
{
    if (typeof callback !== 'function') {
        return null;
    }
    request.postData = "";
    request.on("data", function(data){
        request.postData += data;
        request.postData = JSON.parse(request.postData);
    });
    request.on("end", function(){
        callback();
    });
}

// public methods
function start(route)
{
    function onRequest(request, response) {
        if (request.method == "POST") {
            processPost(request, response, function(){
                var pathname = url.parse(request.url).pathname;
                console.log("Request for [ " + pathname + " ] received.");

                route(pathname, request, response);
                response.end();
            });
        }
    }
    http.createServer(onRequest).listen(8888);
}
exports.start = start;
