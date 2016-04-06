var mysql = require('../../config/mysql');
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