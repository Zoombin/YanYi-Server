var mysql = require('../../config/mysql');
var config = require('../../config/config');
var swig = require('swig');
var fs = require('fs');
var path = require('path');
var aRes = {error:0, msg:'',data:Array()};

exports.add = function(req, res, next){
    var sName = req.param('req_name');
    var sEmail = req.param('req_email');
    var sPhone = req.param('req_phone');
    var sWebsite = req.param('req_website');
    var sReq = req.param('req_req');


     // 添加
    var sql = 'INSERT INTO admin_requirement SET req_name=?,req_email=?,req_phone=?,`req_website`=?,`req_req`=?,created_date=NOW()';
    mysql.query(sql, [sName,sEmail,sPhone,sWebsite,sReq], function(result){
        result.msg = '需求提交成功！';
        return res.send(result);
    });
}

exports.getall = function (req, res, next) {
    var iStart = req.param('START');
    var iPagesize = req.param('PAGESIZE');

    var sql = "SELECT * FROM `admin_requirement` ORDER BY id DESC ";

    var cnt = "SELECT COUNT(*) AS cnt FROM (" + sql + ") t";
    mysql.query(cnt, [], function(result){
        var totalCount = result.data[0].cnt;

        sql += " LIMIT ?,?";
        mysql.query(sql, [iStart*iPagesize, iPagesize*1], function(result){
            var tpl = swig.renderFile('views/admin/segment/require.html', {list: result.data});
            result.tpl = tpl;
            result.totalCount = totalCount;
            return res.send(result);
        });
    });
};