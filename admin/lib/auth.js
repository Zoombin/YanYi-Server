var mysql = require('../../config/mysql');

exports.requiresLogin = function (req, res, next) {
    var username, password;
    if(typeof res.locals.user != 'undefined' && res.locals.user){
        username = res.locals.user.user_name || '';
        password = res.locals.user.password || '';
    }
    var sql = "SELECT * FROM `admin_user` WHERE user_name=? AND `password`=?";
    mysql.query(sql, [username, password], function(result){
        console.log(result);
        if(result.data.length){
            return next();
        }else{
            if (req.method === 'GET') {
                req.session.returnTo = req.originalUrl;
            }
            res.redirect('/admin/login');
        }
    });
    
};

exports.needGroup = function(group) {
    return [this.requiresLogin, function(req, res, next){
        if (req.user.group === 'superuser' || group === req.user.group) {
            next();
        } else {
            res.status(401).send('Unauthorized');
        }
    }];
};