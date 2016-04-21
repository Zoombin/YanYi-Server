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

    var sql = "SELECT * FROM `admin_banner` ORDER BY id DESC ";

    var cnt = "SELECT COUNT(*) AS cnt FROM (" + sql + ") t";
    mysql.query(cnt, [], function(result){
        var totalCount = result.data[0].cnt;

        sql += " LIMIT ?,?";
        mysql.query(sql, [iStart*iPagesize, iPagesize*1], function(result){
            var tpl = swig.renderFile('views/admin/segment/banner.html', {list: result.data});
            result.tpl = tpl;
            result.totalCount = totalCount;
            return res.send(result);
        });
    });
};

exports.add = function(req, res, next){
    var id = req.param('id');
    // var sTitle = req.param('title');
    var sUrl = req.param('cover_url');
    
    if(!(req.files && req.files.cover_url != 'undifined') && !id){
        aRes.error = 1;
        aRes.msg = '请上传BANNER';
        return res.send(aRes);
    }

    if(req.files && req.files.cover_url != 'undifined'){
        // upload cover image
        var size = req.files.cover_url.size;
        var tmp_path = req.files.cover_url.path;
        var filename = req.files.cover_url.name;
        var ext = path.extname(filename);
        var newFilename = (new Date() - 0) + ext;
        var cover_url = '/images/banner/' + newFilename;
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

                if(id){
                    // 更新
                    var sql = "SELECT * FROM `admin_banner` WHERE id=?";
                    mysql.query(sql, [id], function(result){
                        var tmp_url = result.data[0].image_url;
                        if(tmp_url){
                            var file_path = config.clientRoot+tmp_url;
                            if(fs.existsSync(file_path)){
                                fs.unlinkSync(file_path);
                            }
                        }
                        // update record
                        var sql = 'UPDATE admin_banner SET image_url=?,updated_date=NOW() WHERE id=?';
                        mysql.query(sql, [cover_url, id], function(result){
                            return res.send(result);
                        });
                    });
                }else{
                    // 添加
                    var sql = 'INSERT INTO admin_banner SET image_url=?,created_date=NOW()';
                    mysql.query(sql, [cover_url], function(result){
                        return res.send(result);
                    });
                }
            });
        });
        
    }else{
        // 更新时,没有上传封面图片
        // update record
        var sql = 'UPDATE admin_banner SET image_url=?,updated_date=NOW() WHERE id=?';
        mysql.query(sql, [cover_url, id], function(result){
            return res.send(result);
        });
    }
    
}

exports.active = function(req, res, next){
    var id = req.param('id');
    var is_active = req.param('is_active');
    var sql = 'UPDATE admin_banner SET is_active=?,updated_date=NOW() WHERE id=?';
    mysql.query(sql, [is_active,id], function(result){
        return res.send(result);
    });
}

exports.remove = function(req, res, next){
    var id = req.param('id');
    // unlink image
    var sql = "SELECT * FROM `admin_banner` WHERE id=?";
    mysql.query(sql, [id], function(result){
        var cover_url = result.data[0].image_url;
        if(cover_url){
            var file_path = config.clientRoot+cover_url;
            if(fs.existsSync(file_path)){
                fs.unlinkSync(file_path);
            }
        }
        // delete record
        var sql = 'DELETE FROM admin_banner WHERE id=?';
        mysql.query(sql, [id], function(result){
            return res.send(result);
        });
    });
}