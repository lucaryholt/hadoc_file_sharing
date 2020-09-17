const express = require('express');
const fileUpload = require('express-fileupload'); //The library that enables file upload
const uuid = require('uuid'); //makes unique id, so that we get no upload conflicts
const ejs = require('ejs'); //thymeleaf type library
const favicon = require('serve-favicon'); //favicon

const fH = require('./fileHandler');
const aH = require('./argvHandler');
const tH = require('./timeoutHandler');

const app = express();

const argv = aH.processArgv(process.argv);
const ip = argv.ip;
const port = argv.port;
const uploadDir = argv.uploadDir;
const timeout = 3600000;

tH.checkTimeout(uploadDir, timeout, tH.checkTimeout);

//TODO ability to download all files as zip on download page
//TODO max size for download

//Here we enable file upload
app.use(fileUpload({
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: 6
}));

app.use(favicon(__dirname + '/views/favicon.ico'));
app.use(express.static('views'));
app.use(express.json()); //Helps to read body from request
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
        console.log(error);
    }
    //TODO Handle error in better way for client
    //'The download is timed out' maybe
    return res.status(400).send({ error: 'No such id.' });
});

app.get('/download/:id/:name', (req, res) => {
    const id = req.params.id;
    const name = req.params.name;

    try{
        if(id != null && name != null){
            const file = uploadDir + id + '/' + name;
            return res.download(file);
        }
    }catch (error){
        console.log(error);
    }
    //TODO Handle error in better way for client
    //'The download is timed out' maybe
    return res.status(400).send({ error: 'No such file.' });
});

app.post('/upload', async(req, res) => {
    const timeStamp = new Date().getTime();
    const timeoutDate = new Date(timeStamp + timeout);
    const timeoutText = timeoutDate.getHours() + ':' + timeoutDate.getMinutes();
    const id = uuid.v4() + timeStamp;
    const directory = uploadDir + id +  '/';

    try{
        if(!req.files){
            return res.redirect('/');
        } else {
            let fileData = fH.moveFiles(req.files.files, directory, (file, path) => {
                file.mv(path);
            });

            return res.render('uploadComplete',{
                files: fileData,
                shareLink: ip + '/s/' + id,
                ip,
                timeoutText
            });
        }
    }catch (error){
        return res.status(500).send(error);
    }
});

app.listen(port, (error) => {
    if(error){
        console.log('Error starting server.');
    }
    console.log('Server started on port: ', port);
});