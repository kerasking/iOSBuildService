var requestHandler = require("./requestHandler")

function route (pathname, request, response)
{
    var handler = null;

    if (request.method == "POST") {
        handler = requestHandler.postHandler[pathname];
    }
    if (requestHandler.method == "GET") {
        handler = requestHandler.getHandler[pathname];
    }

    handler && handler(request, response);
}

exports.route = route;
