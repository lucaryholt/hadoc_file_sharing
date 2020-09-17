const fH = require('./fileHandler');

module.exports = {
    checkTimeout: function (uploadDir, timeout, getTimeout){
        function checker(){
            const currentTime = new Date().getTime();
            const directories = fH.readDirectory(uploadDir);
            for(let i = 0; i < directories.length; i++){
                const dirTime = Number(directories[i].slice(36));
                if(currentTime - dirTime > timeout){
                    console.log('dir: ' + directories[i] + ' is too old!');
                    fH.deleteDir(uploadDir + directories[i]);
                }
            }
        }

        setInterval(checker, 30000);
    },
    getTimeout: function (dirName, timeout){
        return Number(dirName.slice(36)) + timeout;
    }
}