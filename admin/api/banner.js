var mysql = require('../../config/mysql');
var aRes = {error:0, msg:'',data:Array()};
var default_data = array(
    '/images/banner/1.jpg',
    '/images/banner/2.jpg',
    '/images/banner/3.jpg',
    '/images/banner/4.jpg',
    '/images/banner/5.jpg',
    );

exports.getall = function (req, res, next) {
    var username = req.param('username');
    var password = req.param('password');
    var sql = "SELECT `value`,created_date FROM `admin_config` WHERE type='BASIC_SITE_TITLE'";
    mysql.query(sql, [username, password], function(result){
        if(result.data.length){
            return res.send(result);
        }else{
            aRes.data = default_data;
            return res.send(aRes);
        }
    });
};


