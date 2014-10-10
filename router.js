var requestHandler = require("./requestHandler")

function route (pathname, request, response)
{
    handler = requestHandler.handler[pathname];
    handler && handler(request, response);
}

exports.route = route;
