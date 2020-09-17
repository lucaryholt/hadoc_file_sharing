const express = require('express');
const fileUpload = require('express-fileupload'); // Express middleware - Enables file upload
const uuid = require('uuid'); // Generates unique ID's
const ejs = require('ejs'); // Express middleware - Pass data to HTML
const favicon = require('serve-favicon'); // Enables favicon

// Local files
const fH = require('./fileHandler');
const aH = require('./argvHandler');
const tH = require('./timeoutHandler');
const rH = require('./responseHandler');
const systemStrings = require('./systemStrings.json');
const tools = require('./generalTools');

const app = express();

// System variables
const argv = aH.processArgv(process.argv);
const ip = argv.ip;
const port = argv.port;
const uploadDir = argv.uploadDir;
const maxSize = argv.maxSize;
const timeout = 3600000;

// Starts service that checks upload timeout
tH.checkTimeout(uploadDir, timeout, tH.checkTimeout);

// Enables file upload
app.use(fileUpload({
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: 6
}));

app.use(favicon(__dirname + '/views/favicon.ico'));
app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    return res.render('index', {
        ip: ip
    });
});

app.get('/s/:id', (req, res) => {
    const id = req.params.id;

    try{
        if(id != null){
            const files = fH.readDirectory(uploadDir + id);
            const timeoutDate = new Date(tH.getTimeout(id, timeout));
            const timeoutText = timeoutDate.getHours() + ':' + timeoutDate.getMinutes();

            if (!fH.fileExists(uploadDir + id + '/hadoc-files.zip')) {
                fH.makeZip(files, uploadDir, id);
            }

            return res.render('sharePage', {
                files: fH.getFileList(files, ip, id),
                ip,
                timeoutText
            });
        }
    }catch (error){
        return rH.errorPage(res, systemStrings.errorDownloadExpired, ip);
    }
});

app.get('/download/:id/:name', (req, res) => {
    const id = req.params.id;
    const name = req.params.name;

    try{
        if(id != null && name != null){
            const file = uploadDir + id + '/' + name;
            if(fH.fileExists(file)){
                return res.download(file);
            }

        }
    }catch (error){
        console.log(error);
    }
    return rH.errorPage(res, systemStrings.errorDownloadExpired, ip);
});

app.post('/upload', async(req, res) => {
    const timeStamp = new Date().getTime();
    const id = uuid.v4() + timeStamp;
    const timeoutDate = new Date(timeStamp + timeout);
    const timeoutText = timeoutDate.getHours() + ':' + timeoutDate.getMinutes();
    const directory = uploadDir + id +  '/';

    try{
        if(!req.files){
            return res.redirect('/');
        } else {
            let fileData = fH.moveFiles(req.files.files, directory, maxSize, (file, path) => {
                file.mv(path);
            });

            if(fileData.length !== 0){
                return res.render('uploadComplete',{
                    files: fileData,
                    shareLink: ip + '/s/' + id,
                    ip,
                    timeoutText
                });
            }
            return rH.errorPage(res, systemStrings.errorFileSize, ip);
        }
    }catch (error){
        return res.status(500).send(error);
    }
});

app.listen(port, (error) => {
    if(error){
        console.log('Error starting server.');
    }else{
        tools.printLogo();
        console.log('Server started on port: ', port);
    }
});