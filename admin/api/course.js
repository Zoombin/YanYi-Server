var mysql = require('../../config/mysql');
var config = require('../../config/config');
var swig = require('swig');
var fs = require('fs');
var path = require('path');
var aRes = {error:0, msg:'',data:Array()};

var image_type = Array('.jpg', '.bmg', '.png', '.gif');

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
    if(!req.files.cover_url){
        aRes.error = 1;
        aRes.msg = '请上传课程封面';
        return res.send(aRes);
    }
    if(!sContent){
        aRes.error = 1;
        aRes.msg = '请输入课程内容';
        return res.send(aRes);
    }

    // upload cover image
    var size = req.files.cover_url.size;
    var tmp_path = req.files.cover_url.path;
    var filename = req.files.cover_url.name;
    var ext = path.extname(filename);
    var newFilename = (new Date() - 0) + ext;
    var cover_url = '/images/course/cover/' + newFilename;
    // var target_path = config.clientRoot + cover_url;
    var target_path = './public' + cover_url;
    // 2M
    if(size > 2000000){
        aRes.error = 1;
        aRes.msg = '图片过大';
        fs.unlink(tmp_path);
        return res.send(aRes);
    }
    if(image_type.indexOf(ext) == '-1'){
        aRes.error = 1;
        aRes.msg = '图片类型不合法';
        fs.unlink(tmp_path);
        return res.send(aRes);
    }
    // 移动到相应目录
    fs.readFile(tmp_path, function(err, data){
        fs.writeFile(target_path, data, function(err){
            if(err){
                console.log(err);
                aRes.error = 1;
                aRes.msg = '上传图片出错, 请联系系统管理员';
                fs.unlink(tmp_path);
                return res.send(aRes);
            }
            // 移动成功后 删除临时文件
            fs.unlinkSync(tmp_path);

            var sql = 'INSERT INTO admin_course SET title=?,cover_url=?,content=?,created_date=NOW()';
            mysql.query(sql, [sTitle,cover_url,sContent], function(result){
                return res.send(result);
            });
        });
    });

    // fs.renameSync(tmp_path, target_path, function(err){
    //     console.log(22);
    //     if(err){
    //         console.log(err);
    //         aRes.error = 1;
    //         aRes.msg = '上传图片出错, 请联系系统管理员';
    //         fs.unlink(tmp_path);
    //         return res.send(aRes);
    //     }
    //     console.log(33);
    // });
    // // 移动成功后 删除临时文件
    // fs.unlink(tmp_path);

    // var sql = 'INSERT INTO admin_course SET title=?,cover_url=?,content=?,created_date=NOW()';
    // mysql.query(sql, [sTitle,cover_url,sContent], function(result){
    //     return res.send(result);
    // });
    
}
