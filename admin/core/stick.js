var mysql = require('../../config/mysql');
var swig = require('swig');
var aRes = {error:0, msg:'',data:Array()};

exports.getall = function (req, res, next) {
    var iStart = req.param('START');
    var iPagesize = req.param('PAGESIZE');
    var lang = req.param('lang');

    var sql = "SELECT * FROM `admin_stick` WHERE is_active=1 AND lang=? ORDER BY id DESC ";

    var cnt = "SELECT COUNT(*) AS cnt FROM (" + sql + ") t";
    mysql.query(cnt, [lang], function(result){
        var totalCount = result.data[0].cnt;

        sql += " LIMIT ?,?";
        mysql.query(sql, [lang, iStart*iPagesize, iPagesize*1], function(result){
            var tpl = swig.renderFile('views/segment/stick.html', {list: result.data});
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
    var sql = "SELECT * FROM `admin_stick` WHERE id=?";

    mysql.query(sql, [id], function(result){
        oData.content = result.data[0].content;
        
        var sql = "SELECT * FROM `admin_config` WHERE type='BASIC_SITE_TITLE'";
        mysql.query(sql, [], function(result){
            oData.site_title = result.data[0].value;

            res.render('content', oData);
        });
    });
}