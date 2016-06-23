var mysql = require('../../config/mysql');
var config = require('../../config/config');
var swig = require('swig');
var fs = require('fs');
var path = require('path');
var aRes = {error:0, msg:'',data:Array()};

var image_type = Array('.jpg', '.bmg', '.png', '.gif');

exports.getall = function (req, res, next) {
    var iStart = req.param('START');
    var iPagesize = req.param('PAGESIZE');
    var lang = req.param('lang');

    var param = [];

    var sql = "SELECT id,type,label,is_active,content,created_date FROM `admin_service` WHERE lang=? ORDER BY id ";
    param.push(lang);

    var cnt = "SELECT COUNT(*) AS cnt FROM (" + sql + ") t";
    mysql.query(cnt, param, function(result){
        var totalCount = result.data[0].cnt;

        sql += " LIMIT ?,?";
        param.push(iStart*iPagesize);
        param.push(iPagesize*1);
        mysql.query(sql, param, function(result){
            var tpl = swig.renderFile('views/admin/segment/service.html', {list: result.data});
            result.tpl = tpl;
            result.totalCount = totalCount;
            return res.send(result);
        });
    });
};

exports.add = function(req, res, next){
    var id = req.param('id');
    var sContent = req.param('content');
    // var lang = req.param('lang');
    
    if(!sContent){
        aRes.error = 1;
        aRes.msg = '请输入课程内容';
        return res.send(aRes);
    }

    // update record
    var sql = 'UPDATE admin_service SET content=?,updated_date=NOW() WHERE id=?';
    mysql.query(sql, [sContent, id], function(result){
        return res.send(result);
    });
}
