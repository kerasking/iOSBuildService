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
