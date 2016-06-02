var config = require('./config');
var bodyParser = require('body-parser');

var ueditor = require('ueditor');


/**
 * config multi rich-text editor
 * 
 * @method exports
 * @param  object | app
 * @return mixed
 *
 * @author wesley zhang <wesley_zh@qq.com>
 * @since  2016-04-08T01:20:56+0800
 */
module.exports = function (app) {

    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json());

    app.use("/admin/course/ue", ueditor(config.clientRoot, course_editor));
    app.use("/admin/activity/ue", ueditor(config.clientRoot, activity_editor));
    app.use("/admin/stick/ue", ueditor(config.clientRoot, stick_editor));
    app.use("/admin/team/ue", ueditor(config.clientRoot, team_editor));
    
}

// business method
var course_editor = function(req, res, next){
    var save_url = '/images/course/content';
    _basic(req, res, next, save_url);
}
var activity_editor = function(req, res, next){
    var save_url = '/images/activity/content';
    _basic(req, res, next, save_url);
}
var stick_editor = function(req, res, next){
    var save_url = '/images/stick/content';
    _basic(req, res, next, save_url);
}
var team_editor = function(req, res, next){
    var save_url = '/images/team/content';
    _basic(req, res, next, save_url);
}

var _basic = function(req, res, next, save_url){
    // ueditor 客户发起上传图片请求
    if(req.query.action === 'uploadimage'){
        var foo = req.ueditor;
        var imgname = foo.filename;
        // console.log(foo);

        var img_url = save_url;
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage'){
        var dir_url = save_url;
        res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json')
    }
}
