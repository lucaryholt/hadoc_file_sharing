const systemStrings = require('../json/systemStrings.json');

module.exports = {
    printLogo: function (){
        console.log("\u001B[32m");
        console.log(systemStrings.logo);
        console.log("\u001B[0m");
    },
    getTimeString: function (date, timeout){
        const timeStamp = new Date().getTime();

        let hours = date.getHours();
        let minutes = date.getMinutes();

        if(String(hours).length !== 2){
            const zero = '0';
            hours = zero.concat(hours);
        }

        if(String(minutes).length !== 2){
            const zero = '0';
            minutes = zero.concat(minutes);
        }

        return hours + ':' + minutes;
    }
}