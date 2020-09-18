# Hadoc File Sharing
File sharing website made with Node.JS and Express framework. Created as a learning exercise.

## Installation
### Unix systems:
Run following command in directory where you want to install Hadoc.

> `curl https://raw.githubusercontent.com/lucaryholt/hadoc_file_sharing/master/hadoc.sh > hadoc.sh ; chmod +x hadoc.sh  ; ./hadoc.sh`

Notice: This command downloads a script, changes permissions for said script and runs the script.

### Windows:
No automated installation. Simply clone project, run `npm i` and then `node app.js`.

### Generel
Node.JS (and NPM) needs to be installed on your system.

## Command line arguments:
> usage: app.js [--help] [--dir <path>] [--ip <ip-address>] [--port <port number>] [--mxSize <size in MB>] [--sV] <br>
>   '--dir'   : Directory for uploaded files. Needs to end with a '/'. (Default: './uploads/') <br>
>   '--ip'    : The IP users connect to in browser. Examples: 'www.example.com' & 'example.com:8080'. Do not include 'http://'. (Default: 'localhost:8080') <br>
>   '--port'  : The port will listen to packets on. (Default: '8080') <br>
>   '--mxSize': Maximum size for user uploaded files in MB. (Default: '14') <br> 
>   '--sV'    : Show values for arguments on start up.
