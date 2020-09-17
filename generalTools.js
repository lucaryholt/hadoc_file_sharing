const systemStrings = require('./systemStrings.json');

module.exports = {
    printLogo: function (){
        console.log("\u001B[32m");
        console.log(systemStrings.logo);
        console.log("\u001B[0m");
    }
}