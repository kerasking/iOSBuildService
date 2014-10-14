iOS Build Service
=================

provide an HTTP URL for other program to call, and then build iOS project

Dependencies
------------

1. download [Gearman's source code](https://launchpad.net/gearmand), and here is Gearman's official site: [Gearman](http://gearman.org)

  download Gearman's source code and build it, then run `gearmand -d` in terminal.

2. [node-gearman](https://github.com/mreinstein/node-gearman)

  `npm install gearman`

3. [execSync](https://github.com/mgutz/execSync)

  `npm install execSync`

Deploy
------

  run `scripts/deploy.sh` and `scripts/startWorkers.sh`

  this Service is running at port 8888, you can call it as:

  `http://localhost:8888/build`

How to Use
----------

  1. setting your project
    
    in your XCode project, you should have a `BashScripts` dir like this:


        ├─XcodeProject
        │   ├── BashScripts
        │   │   ├── build.sh
        │   │   ├── create.sh
        │   │   └── update.sh

    `build.sh` is used by worker to build your project, here is a template build.sh for you:

    ```bash
    #!/bin/bash

    die() {
        echo "$*" >&2
        say "tsen poo jow, tsen poo jow, tsen poo jow, failed, to, build, Expended, Business, come here to check the log~!"
        exit 1
    }

    app_name="APEB_`date '+%Y_%m_%d_%H_%M_%S'`"

    # 这三个变量是根据项目的不同而有变化的
    workspace_path="../Expended-Business.xcworkspace"
    scheme="Expended-Business"
    configuration="Debug"

    # 一般情况下以下变量都不需要修改
    current_dir=`pwd`

    build_dir="$current_dir/destination/build"
    symble_dir="$current_dir/destination/symbols"

    archive_dir="$current_dir/destination/archive"
    archive_path="$archive_dir/${app_name}"

    ipa_dir="$current_dir/destination/ipa"
    ipa_path="$ipa_dir/${app_name}"

    mkdir -p $build_dir
    mkdir -p $symble_dir
    mkdir -p $archive_dir
    mkdir -p $ipa_dir

    xcodebuild -workspace "$workspace_path" -scheme "$scheme" -configuration "$configuration" CONFIGURATION_BUILD_DIR="$build_dir" DWARF_DSYM_FOLDER_PATH="$symble_dir" -archivePath "$archive_path" archive || die "Build Failed"
    xcodebuild -exportArchive -exportFormat IPA -archivePath "$archive_path.xcarchive" -exportPath "$ipa_path" -exportSigningIdentity 'iPhone Distribution: Shanghai Andpay  Information Technology Co., Ltd.' || die "make ipa failed"

    echo $ipa_path.ipa
    say "construction complete!"
    ```

    `create.sh` and `update.sh` is used by worker to create or update your project.

  2. calling API
    
    you can calling API with CURL:

```bash
    curl -H "Content-Type: application/json" -d "{appname:'APEB'}" -X POST http://locahost:8888/build
```

if you hear "construction complete", that means build successed. you can find your IPA at the path which was defined by your `build.sh`

FAQ
---

1. what's the format of the request to call API?

    iOS Build Service Only receives POST requests, and there is only one API here.

    URL:

        /build

    Header:

        `Content-Type: application/json`

    Body:

        `{appname:"APEB"}`

2. how to add an API?

    in file requestHandler.js, handle function and URL to handle can be setted at once:

    ```javascript
        postHandler["/foo"] = function(request, response){
            bar;
        };
    ```

    which the URL is /foo, method is POST, and the function is paramed with request and response which are general nodeJS objects.

3. how to use config file?

    in the `workers` directory, there is a config file to indicate information for build worker.

    here is an example:

    ```javascript
    configuration["buildWorker"] = {
        "APEB":{
            "repo":"git@gitcafe.com:casatwy/Expended-Business.git",
            "projectPath":"/Users/zhouxuecheng/iOSBuildProjects/APEB",
            "projectDirName":"Expended-Business"
        }
    };
    ```

    `APEB` is the appname which was sent by your request

    in `APEB`, there are `repo`, `projectPath`, and `projectDirName`. `projectDirName` is the directory name after running `git clone`, always same as the last segment of repo. worker will enter this directory and find `BashScript/create.sh` to create your project.


