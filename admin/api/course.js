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

    var sql = "SELECT id,title,is_active,cover_url,content,sort_order,created_date FROM `admin_course` WHERE lang=? AND is_draft=0 ORDER BY id DESC ";
    param.push(lang);

    var cnt = "SELECT COUNT(*) AS cnt FROM (" + sql + ") t";
    mysql.query(cnt, param, function(result){
        var totalCount = result.data[0].cnt;

        sql += " LIMIT ?,?";
        param.push(iStart*iPagesize);
        param.push(iPagesize*1);
        mysql.query(sql, param, function(result){
            var tpl = swig.renderFile('views/admin/segment/course.html', {list: result.data});
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
    var sUrl = req.param('cover_url');
    var lang = req.param('lang');
    var sort_order = req.param('sort_order');
    var is_draft = req.param('is_draft');
    if (is_draft != 1) {
        if(!sTitle){
            aRes.error = 1;
            aRes.msg = '请输入课程名称';
            return res.send(aRes);
        }
        if(!(req.files && req.files.cover_url != 'undifined') && !id){
            aRes.error = 1;
            aRes.msg = '请上传课程封面';
            return res.send(aRes);
        }
        if(!sContent){
            aRes.error = 1;
            aRes.msg = '请输入课程内容';
            return res.send(aRes);
        }
    }
    if(!sort_order){
        sort_order = 500;
    }

    if(req.files && req.files.cover_url != 'undifined'){
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

                if(id){
                    // 更新
                    var sql = "SELECT id,title,is_active,cover_url,content,created_date FROM `admin_course` WHERE id=?";
                    mysql.query(sql, [id], function(result){
                        var tmp_url = result.data[0].cover_url;
                        if(tmp_url){
                            var file_path = config.clientRoot+tmp_url;
                            if(fs.existsSync(file_path)){
                                fs.unlinkSync(file_path);
                            }
                        }
                        // update record
                        var sql = 'UPDATE admin_course SET title=?,cover_url=?,content=?, is_draft=?, updated_date=NOW() WHERE id=?';
                        mysql.query(sql, [sTitle,cover_url,sContent, is_draft, id], function(result){
                            result.data.id = id;
                            result.data.cover_url = cover_url;
                            return res.send(result);
                        });
                    });
                }else{
                    // 添加
                    var sql = 'INSERT INTO admin_course SET title=?,cover_url=?,content=?,lang=?,sort_order=?, is_draft=?, created_date=NOW()';
                    mysql.query(sql, [sTitle,cover_url,sContent,lang,sort_order, is_draft], function(result){
                        result.data.id = result.data.insertId;
                        result.data.cover_url = result.data.cover_url;
                        return res.send(result);
                    });
                }
            });
        });
        
    }else{
        if(id){
            // 更新时,没有上传封面图片
            // update record
            var sql = 'UPDATE admin_course SET title=?,content=?,sort_order=?,updated_date=NOW() WHERE id=?';
            mysql.query(sql, [sTitle,sContent,sort_order, id], function(result){
                result.data.id = id;
                return res.send(result);
            });
        }else{
            // 添加
            var sql = 'INSERT INTO admin_course SET title=?,cover_url=?,content=?,lang=?,sort_order=?, is_draft=?, created_date=NOW()';
            mysql.query(sql, [sTitle,cover_url,sContent,lang,sort_order, is_draft], function(result){
                result.data.id = result.data.insertId;
                return res.send(result);
            });
        }
    }

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

// get draft
exports.draft = function(req, res, next){
    var lang = req.param('lang');
    var sql = "SELECT * FROM `admin_course` WHERE is_draft=1 AND lang=? LIMIT 1";

    mysql.query(sql, [lang], function(result){
        if(result.data.length){
            var t = result.data[0];
            result.data = t;
        }
        return res.send(result);
    });
}

exports.active = function(req, res, next){
    var id = req.param('id');
    var is_active = req.param('is_active');
    var sql = 'UPDATE admin_course SET is_active=?,updated_date=NOW() WHERE id=?';
    mysql.query(sql, [is_active,id], function(result){
        return res.send(result);
    });
}

exports.remove = function(req, res, next){
    var id = req.param('id');
    // unlink image
    var sql = "SELECT id,title,is_active,cover_url,content,created_date FROM `admin_course` WHERE id=?";
    mysql.query(sql, [id], function(result){
        var cover_url = result.data[0].cover_url;
        if(cover_url){
            var file_path = config.clientRoot+cover_url;
            if(fs.existsSync(file_path)){
                fs.unlinkSync(file_path);
            }
        }
        // delete record
        var sql = 'DELETE FROM admin_course WHERE id=?';
        mysql.query(sql, [id], function(result){
            return res.send(result);
        });
    });
}