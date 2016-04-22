var mysql = require('../../config/mysql');
var config = require('../../config/config');
var swig = require('swig');
var fs = require('fs');
var officegen = require('officegen');
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


exports.exportexcel = function(req, res, next){
    var aRes = {error:0, msg:'',data:Array()};
    var xlsx = officegen ({'type':'xlsx', 'creator':'YanYi'});
    var target_path = '/output/YanYi_liuyan.xlsx';

    xlsx.on ( 'finalize', function ( written ) {
                // console.log ( 'Finish to create an Excel file.\nTotal bytes created: ' + written + '\n' );
                aRes.error= 0;
                aRes.msg= 'Excel创建成功，正在下载...';
                aRes.path = target_path;
                return res.send(aRes);
            });

    xlsx.on ( 'error', function ( err ) {
                aRes.error= 1;
                aRes.msg= err;
                return res.send(aRes);
            });

    sheet = xlsx.makeNewSheet ();
    sheet.name = '留言列表';

    // 标题
    sheet.data[0] = [];
    sheet.data[0][0] = '姓名';
    sheet.data[0][1] = '电话';
    sheet.data[0][2] = '邮箱';
    sheet.data[0][3] = '网址';
    sheet.data[0][4] = '需求';

    // 数据
    var sql = "SELECT req_name,req_phone,req_email,req_website,req_req FROM `admin_requirement` ORDER BY id DESC ";

    mysql.query(sql, [], function(result){
        var list = result.data;
        if(list.length){
            for (var i = 0; i < list.length; i++) {
                var n = i+1;
                sheet.data[n] = [];
                var t = list[i];
                var m = 0;
                for (var j in t) {
                    sheet.data[n][m] = t[j];
                    m++;
                };
            };
        }

        var out = fs.createWriteStream ( config.clientRoot+target_path );
        out.on ( 'error', function ( err ) {
            aRes.error= 1;
            aRes.msg= '创建文件出错，请联系管理员。';
            return res.send(aRes);
        });
        xlsx.generate ( out );
    });
}

exports.downloadexcel = function(req, res, next){
    var target_path = '/output/YanYi_liuyan.xlsx';
    res.download(config.clientRoot+target_path, 'YanYi.xlsx', function(err){
    // res.sendfile(config.clientRoot+'/output/folder.txt', function(err){
        console.log(err);
        console.log(res.headerSent);
        if (err) {
            aRes.error= 1;
            aRes.msg= '文件下载失败';
            // return res.send(aRes);
        } else {
            aRes.error= 0;
            aRes.msg= '文件下载成功，请保存。';
            // return res.send(aRes);
        }
    });
}