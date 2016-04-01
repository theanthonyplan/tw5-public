##Installation

##Prepare Project Directory

Create a new directory.

    $ mkdir tw5-public

##Run Build Script

Run the build script, it requires 2 parameters.  The first param is the name of the new project (I try to keep my names 4 chars or less so that the export vars don't get too long).   The second param is the port that the host (the tw5 server) will be listening on.  

Its often convenient to set the tw5-auth port number as hostPort+1.

    $ ./build-tw-project.sh projName hostPort

##Starting Servers

Run the startup script from the project root (../tw5-public).  It is important to make sure that you use `source` otherwise the PID values will not be exported into the environment.  Use care while executing this step from inside of a script.

    $ source ./start-projName-tw5.sh

##Stopping Servers

Kill the processes quickly by using the exported PID values

    $ kill $TW_projName_PID $TW_AUTH_projName_PID`

 or by using the `jobs` and `kill %jobNumber

##Reporting Server Status

Get the running processes for this user and use grep to filter out the two types of servers that we've launched.

    $ ps -u | grep [t]iddlywiki;  ps -u | grep [a]uth/app.js
