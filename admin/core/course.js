var mysql = require('../../config/mysql');
var swig = require('swig');
var aRes = {error:0, msg:'',data:Array()};

exports.getall = function (req, res, next) {
    var lang = req.param('lang');

    var sql = "SELECT id,title,is_active,cover_url,content,created_date FROM `admin_course` WHERE is_active=1 AND lang=? AND is_draft=0 ORDER BY sort_order DESC,id DESC ";

    var cnt = "SELECT COUNT(*) AS cnt FROM (" + sql + ") t";
    mysql.query(cnt, [lang], function(result){
        var totalCount = result.data[0].cnt;
        mysql.query(sql, [lang], function(result){
            var tpl = swig.renderFile('views/segment/course.html', {list: result.data});
            result.tpl = tpl;
            result.totalCount = totalCount;
            return res.send(result);
        });
    });
};

// 渲染 课程详情页面
exports.renderone = function(req, res, next){
    var oData = [];
    var id = req.param('id');
    var sql = "SELECT id,title,is_active,cover_url,content,created_date FROM `admin_course` WHERE id=?";

    mysql.query(sql, [id], function(result){
        oData.content = result.data[0].content;
        
        var sql = "SELECT * FROM `admin_config` WHERE type='BASIC_SITE_TITLE'";
        mysql.query(sql, [], function(result){
            oData.site_title = result.data[0].value;

            res.render('content', oData);
        });
    });
}