var jobDispatcher = require("./jobDispatcher");

var postHandler = {};
var getHandler = {};


postHandler["/build"] = function(request, response) {
    var appname = request.postData.appname;
    var jobDescription = {
        jobname:"build",
        payload:{
            appname:appname
        },
        completeHandler:function(jobDescription){
            console.log("job completed");
            console.log(jobDescription.result.toString());
        }
    };
    jobDispatcher.dispatchJob(jobDescription);
};

exports.postHandler = postHandler;
exports.getHandler = getHandler;
