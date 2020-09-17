module.exports = {
    errorPage: function (res, errorMessage, ip){
        return res.render('errorPage',{
            errorMessage,
            ip
        });
    }
}