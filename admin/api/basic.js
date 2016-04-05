var mysql = require('../../config/mysql');
var aRes = {error:0, msg:'',data:Array()};

exports.getall = function (req, res, next) {
    var sql = "SELECT `value`,created_date FROM `admin_config` WHERE type='BASIC_SITE_TITLE'";
    mysql.query(sql, [], function(result){
        return res.send(result);
    });
};

exports.update = function (req, res, next) {
    var sSiteTitle = req.param('site_title');
    if(!sSiteTitle){
        aRes.error = 1;
        aRes.msg = '请输入网站标题';
        return res.send(aRes);
    }
    var sql = "UPDATE `admin_config` SET `value`=?,updated_date=NOW() WHERE type='BASIC_SITE_TITLE'";
    mysql.query(sql, [sSiteTitle], function(result){
        return res.send(result);
    });
};

