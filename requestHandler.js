var handler = {}
var Gearman = require("gearman").Gearman

handler["/test"] = function test(request, response)
{
    var client = new Gearman("localhost", 4730, {timeout:3000});
    client.on("WORK_COMPLETE", function(job){
        console.log("this is work complete");
        console.log(job.payload.toString());
        client.close();
    });
    client.connect(function(){
        client.submitJob("testFunction", "this is client test");
    });
    response.write("here i am");
};

handler["/build"] = function(request, response) {
    console.log(request);
};

exports.handler = handler;
