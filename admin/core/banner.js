var mysql = require('../../config/mysql');
var swig = require('swig');
var aRes = {error:0, msg:'',data:Array()};

exports.getall = function (req, res, next) {
    var iStart = req.param('START');
    var iPagesize = req.param('PAGESIZE');

    var sql = "SELECT * FROM `admin_banner` WHERE is_active=1 ORDER BY id DESC ";

    var cnt = "SELECT COUNT(*) AS cnt FROM (" + sql + ") t";
    mysql.query(cnt, [], function(result){
        var totalCount = result.data[0].cnt;

        sql += " LIMIT ?,?";
        mysql.query(sql, [iStart*iPagesize, iPagesize*1], function(result){
            var tpl = swig.renderFile('views/segment/banner.html', {list: result.data});
            result.tpl = tpl;
            result.totalCount = totalCount;
            return res.send(result);
        });
    });
};
