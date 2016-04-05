var mysql = require('../../config/mysql');

exports.login = function (req, res, next) {
    var username = req.param('username');
    var password = req.param('password');
    var sql = "SELECT * FROM `admin_user` WHERE user_name=? AND `password`=?";
    mysql.query(sql, [username, password], function(result){
        if(result.data.length){
            req.session.user = result.data[0];
            res.redirect('/admin');
        }else{
            req.session.error_msg = "用户名或密码错误";
            return res.redirect('admin/login');
        }
    });
};
exports.logout = function (req, res) {
    req.session.user = null;
    res.redirect('/admin/login');
};

