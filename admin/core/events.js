var mysql = require('../../config/mysql');
var swig = require('swig');
var aRes = {error:0, msg:'',data:Array()};

var badge = ['warning','danger','info','success','primary'];
// 渲染 event页面
exports.getpage = function(req, res, next){
    var oData = [];
    // load lang
    var lang = req.param('lang');
    if(!lang) lang = 'zh_cn';
    var lang = require('../lang/' + lang +'.json')
    oData.lang = lang;
    // get website title
    var sql = "SELECT * FROM `admin_config` WHERE type='BASIC_SITE_TITLE'";
    mysql.query(sql, [], function(result){
        oData.site_title = result.data[0].value;

        res.render('events', oData);
    });
}

exports.getall = function (req, res, next) {
    var sStartDate = req.param('start_date');
    var sEndDate = req.param('end_date');

    var sql = "SELECT * FROM `admin_event` WHERE event_date BETWEEN ? AND ? ORDER BY event_date DESC";

    var cnt = "SELECT COUNT(*) AS cnt FROM (" + sql + ") t";
    mysql.query(cnt, [sStartDate,sEndDate], function(result){
        var totalCount = result.data[0].cnt;

        mysql.query(sql, [sStartDate,sEndDate], function(result){
            var tpl = swig.renderFile('views/segment/event.html', {list: result.data});
            result.tpl = tpl;
            result.totalCount = totalCount;
            return res.send(result);
        });
    });
};

// 渲染 event页面
exports.renderone = function(req, res, next){
    var oData = [];
    var id = req.param('id');
    var sql = "SELECT * FROM `admin_activity` WHERE id=?";

    mysql.query(sql, [id], function(result){
        oData.content = result.data[0].content;
        
        var sql = "SELECT * FROM `admin_config` WHERE type='BASIC_SITE_TITLE'";
        mysql.query(sql, [], function(result){
            oData.site_title = result.data[0].value;

            res.render('content', oData);
        });
    });
}