var mysql = require('../../config/mysql');
var swig = require('swig');
var aRes = {error:0, msg:'',data:Array()};

exports.getall = function (req, res, next) {
    var iStart = req.param('START');
    var iPagesize = req.param('PAGESIZE');

    var oData = [], aExistId = Array();

    // get big video
    var sql = "SELECT * FROM `admin_video` WHERE is_active=1 AND show_type=3 ORDER BY id DESC LIMIT 1 ";
    mysql.query(sql, [], function(result){
        oData.video3 = result.data;
        for (var i = 0; i < result.data.length; i++) {
            var t = result.data[i];
            aExistId.push(t.id);
        };
        // get middle video
        var sql = "SELECT * FROM `admin_video` WHERE is_active=1 AND show_type=2 ORDER BY id DESC LIMIT 2 ";
        mysql.query(sql, [], function(result){
            oData.video2 = result.data;
            for (var i = 0; i < result.data.length; i++) {
                var t = result.data[i];
                aExistId.push(t.id);
            };
            // get small video
            var sql = "SELECT * FROM `admin_video` WHERE is_active=1 AND show_type=1 ORDER BY id DESC LIMIT 6 ";
            mysql.query(sql, [], function(result){
                oData.video1 = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    var t = result.data[i];
                    aExistId.push(t.id);
                };
                // get video list
                var sql = "SELECT * FROM `admin_video` WHERE is_active=1 AND id NOT IN (?) ORDER BY id DESC LIMIT ?,? ";
                mysql.query(sql, [aExistId, iStart*iPagesize, iPagesize*1], function(result){
                    oData.videolist = result.data;
                    var tpl = swig.renderFile('views/segment/video.html', {data:oData});
                    result.tpl = tpl;
                    return res.send(result);
                });
            });
        });
    });

};
