module.exports = {
    processArgv: function (argv, helpText){
        let uploadDir = './uploads/';
        let ip = 'localhost:8080';
        let port = 8080;
        let maxSize = 14;

        let showValues = false;

        if(argv.indexOf('--help') !== -1){
            console.log(helpText);
            process.exit(1);
        }

        const dirIndex = argv.indexOf('--dir');
        if(dirIndex !== -1 && argv.length > dirIndex + 1){
            uploadDir = argv[dirIndex + 1];
        }

        const ipIndex = argv.indexOf('--ip');
        if(ipIndex !== -1 && argv.length > ipIndex + 1){
            ip = argv[ipIndex + 1];
        }

        const portIndex = argv.indexOf('--port');
        if(portIndex !== -1 && argv.length > portIndex + 1){
            port = Number(argv[portIndex + 1]);
        }

        const mxIndex = argv.indexOf('--mxSize');
        if(mxIndex !== -1 && argv.length > mxIndex + 1){
            maxSize = Number(argv[mxIndex + 1]);
        }

        const sVIndex = argv.indexOf('--sV');
        if(sVIndex !== -1){
            showValues = true;
        }

        if(showValues){
            console.log('Upload directory: ', uploadDir);
            console.log('IP: ', ip);
            console.log('Port: ', port);
            console.log('Max file size: ',maxSize);
        }

        return {
            uploadDir,
            ip,
            port,
            maxSize
        };
    }
}