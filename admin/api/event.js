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

    var sql = "SELECT * FROM `admin_event` ORDER BY id DESC ";

    var cnt = "SELECT COUNT(*) AS cnt FROM (" + sql + ") t";
    mysql.query(cnt, [], function(result){
        var totalCount = result.data[0].cnt;

        sql += " LIMIT ?,?";
        mysql.query(sql, [iStart*iPagesize, iPagesize*1], function(result){
            var tpl = swig.renderFile('views/admin/segment/event.html', {list: result.data});
            result.tpl = tpl;
            result.totalCount = totalCount;
            return res.send(result);
        });
    });
};

exports.add = function(req, res, next){
    var id = req.param('id');
    var sEventDate = req.param('event_date');
    var sContent = req.param('content');
    if(!sEventDate){
        aRes.error = 1;
        aRes.msg = '请输入事件日期';
        return res.send(aRes);
    }
    if(!sContent){
        aRes.error = 1;
        aRes.msg = '请输入事件内容';
        return res.send(aRes);
    }

    if(id){
        // 更新
        var sql = 'UPDATE admin_event SET event_date=?,content=?,updated_date=NOW() WHERE id=?';
        mysql.query(sql, [sEventDate,sContent, id], function(result){
            return res.send(result);
        });
    }else{
        // 添加
        var sql = 'INSERT INTO admin_event SET event_date=?,content=?,created_date=NOW()';
        mysql.query(sql, [sEventDate,sContent], function(result){
            return res.send(result);
        });
    }
    
}

exports.active = function(req, res, next){
    var id = req.param('id');
    var is_active = req.param('is_active');
    var sql = 'UPDATE admin_event SET is_active=?,updated_date=NOW() WHERE id=?';
    mysql.query(sql, [is_active,id], function(result){
        return res.send(result);
    });
}

exports.remove = function(req, res, next){
    var id = req.param('id');
    // unlink image
    // var sql = "SELECT * FROM `admin_event` WHERE id=?";
    // mysql.query(sql, [id], function(result){
    //     var cover_url = result.data[0].cover_url;
    //     if(cover_url){
    //         var file_path = config.clientRoot+cover_url;
    //         if(fs.existsSync(file_path)){
    //             fs.unlinkSync(file_path);
    //         }
    //     }
        // delete record
        var sql = 'DELETE FROM admin_event WHERE id=?';
        mysql.query(sql, [id], function(result){
            return res.send(result);
        });
    // });
}