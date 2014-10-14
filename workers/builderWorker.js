var Gearman = require("gearman").Gearman;
var shell = require("execSync");
var config = require("./config");
var fs = require("fs");

var worker = new Gearman('localhost', 4730);

worker.on("JOB_ASSIGN", function(job){
    var payload = JSON.parse(job.payload);
    var repo = config.configuration["buildWorker"][payload.appname].repo;
    var projectPath = config.configuration["buildWorker"][payload.appname].projectPath;
    var projectDirName = config.configuration["buildWorker"][payload.appname].projectDirName;

    shell.run("mkdir -p " + projectPath);
    if (!fs.existsSync(projectPath+"/"+projectDirName)) {
        console.log("creating project");
        shell.run("cd " + projectPath + " && git clone " + repo);
        shell.run("cd "+projectPath+"/"+projectDirName+"/BashScripts && source ./create.sh");
        console.log("create finished");
    } else {
        console.log("updating project");
        shell.run("cd "+projectPath+"/"+projectDirName+"/BashScripts && source ./update.sh");
        console.log("update finsihed")
    }

    var result = shell.run("cd "+projectPath+"/"+projectDirName+"/BashScripts && source ./build.sh");
    console.log("build result is " + result);

    worker.sendWorkComplete(job.handle, "");
    worker.preSleep();
});

worker.on('NOOP', function(){
    worker.grabJob();
});

worker.connect(function(){
    worker.addFunction("build");
    worker.preSleep();
});
