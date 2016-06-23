var mysql = require('../../config/mysql');
var swig = require('swig');
var aRes = {error:0, msg:'',data:Array()};

// 渲染 课程详情页面
exports.renderone = function(req, res, next){
    var oData = [];
    var id = req.param('id');
    var sql = "SELECT id,label,is_active,content,created_date FROM `admin_service` WHERE id=?";

    mysql.query(sql, [id], function(result){
        oData.content = result.data[0].content;
        
        var sql = "SELECT * FROM `admin_config` WHERE type='BASIC_SITE_TITLE'";
        mysql.query(sql, [], function(result){
            oData.site_title = result.data[0].value;

            res.render('content', oData);
        });
    });
}