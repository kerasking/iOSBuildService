var Gearman = require("gearman").Gearman;

var worker = new Gearman('localhost', 4730);

worker.on("JOB_ASSIGN", function(job){
    console.log("job assigned");
    console.log(job);
    result = "job completed";
    worker.sendWorkComplete(job.handle, result);
});

worker.on('NOOP', function(){
    worker.grabJob();
});

worker.connect(function(){
    worker.addFunction("testFunction");
    worker.preSleep();
});
