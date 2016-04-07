var mysql = require('../../config/mysql');
var config = require('../../config/config');
var aRes = {error:0, msg:'',data:Array()};
var swig = require('swig');

exports.getall = function (req, res, next) {
    var sql = "SELECT id,title,cover_url,content,created_date FROM `admin_course` ORDER BY id DESC";
    mysql.query(sql, [], function(result){
        var tpl = swig.renderFile('views/admin/segment/course.html', {list: result.data});
        result.tpl = tpl;
        return res.send(result);
    });
};

exports.add = function(req, res, next){
    var sTitle = req.param('title');
    var sContent = req.param('content');
    if(!sTitle){
        aRes.error = 1;
        aRes.msg = '请输入课程名称';
        return res.send(aRes);
    }
    if(!sContent){
        aRes.error = 1;
        aRes.msg = '请输入课程内容';
        return res.send(aRes);
    }
    if(req.files.cover_url){
        // upload cover image
        console.log(req.files);
    }
    
    return res.send(aRes);
}

var ueditor = require("ueditor");
var path = require('path');
exports.ue = function(req, res, next){
    ueditor(config.clientRoot, function(req, res, next) {
        // ueditor 客户发起上传图片请求
        if(req.query.action === 'uploadimage'){
            // 这里你可以获得上传图片的信息
            var foo = req.ueditor;
            console.log(foo); // exp.png
            console.log(foo.filename); // exp.png
            console.log(foo.encoding); // 7bit
            console.log(foo.mimetype); // image/png

            var img_url = '/images/course/';
            res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        }
        //  客户端发起图片列表请求
        else if (req.query.action === 'listimage'){
            var dir_url = '/images/course/';
            res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
        }
        // 客户端发起其它请求
        else {
            res.setHeader('Content-Type', 'application/json');
            res.redirect('/ueditor/nodejs/config.json')
        }
        
    });
}