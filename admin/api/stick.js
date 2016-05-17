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

    var sql = "SELECT * FROM `admin_stick` WHERE lang=? ORDER BY id DESC ";

    var cnt = "SELECT COUNT(*) AS cnt FROM (" + sql + ") t";
    mysql.query(cnt, [lang], function(result){
        var totalCount = result.data[0].cnt;

        sql += " LIMIT ?,?";
        mysql.query(sql, [lang, iStart*iPagesize, iPagesize*1], function(result){
            var tpl = swig.renderFile('views/admin/segment/stick.html', {list: result.data});
            result.tpl = tpl;
            result.totalCount = totalCount;
            return res.send(result);
        });
    });
};

exports.add = function(req, res, next){
    var id = req.param('id');
    var sTitle = req.param('title');
    var sContent = req.param('content');
    var lang = req.param('lang');
    if(!sTitle){
        aRes.error = 1;
        aRes.msg = '请输入活动名称';
        return res.send(aRes);
    }
    if(!sContent){
        aRes.error = 1;
        aRes.msg = '请输入活动内容';
        return res.send(aRes);
    }

    if(id){
        // update record
        var sql = 'UPDATE admin_stick SET title=?,`content`=?,updated_date=NOW() WHERE id=?';
        mysql.query(sql, [sTitle,sContent, id], function(result){
            return res.send(result);
        });
    }else{
        // 添加
        var sql = 'INSERT INTO admin_stick SET title=?,`content`=?,lang=?,created_date=NOW()';
        mysql.query(sql, [sTitle,sContent,lang], function(result){
            return res.send(result);
        });
    }
    
}

exports.active = function(req, res, next){
    var id = req.param('id');
    var is_active = req.param('is_active');
    var sql = 'UPDATE admin_stick SET is_active=?,updated_date=NOW() WHERE id=?';
    mysql.query(sql, [is_active,id], function(result){
        return res.send(result);
    });
}

exports.remove = function(req, res, next){
    var id = req.param('id');
    // delete record
    var sql = 'DELETE FROM admin_stick WHERE id=?';
    mysql.query(sql, [id], function(result){
        return res.send(result);
    });
}