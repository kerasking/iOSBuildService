/*
 *
 * jobDescription's structure:
 *
 *  {
 *      jobname:"build",
 *      payload:{
 *          appname:"APEB"
 *      },
 *      completeHandler:function(jobDescriptor){
 *      },
 *      result:{}
 *  }
 *
 * */

var Gearman = require("gearman").Gearman;

function dispatchJob(jobDescription)
{
    var client = new Gearman("localhost", 4730, {timeout:3000});
    client.on("WORK_COMPLETE", function(job){
        jobDescription.result = job.payload;
        jobDescription.completeHandler(jobDescription);
        client.close();
    });
    client.connect(function(){
        client.submitJob(jobDescription.jobname, JSON.stringify(jobDescription.payload));
    }); }
exports.dispatchJob = dispatchJob;
