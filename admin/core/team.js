var mysql = require('../../config/mysql');
var swig = require('swig');
var aRes = {error:0, msg:'',data:Array()};

exports.getall = function (req, res, next) {
    var iStart = req.param('START');
    var iPagesize = req.param('PAGESIZE');
    var lang = req.param('lang');

    var sql = "SELECT * FROM `admin_team` WHERE is_active=1 AND lang=? ORDER BY id DESC ";

    var cnt = "SELECT COUNT(*) AS cnt FROM (" + sql + ") t";
    mysql.query(cnt, [lang], function(result){
        var totalCount = result.data[0].cnt;

        sql += " LIMIT ?,?";
        mysql.query(sql, [lang, iStart*iPagesize, iPagesize*1], function(result){
            for(var i=0;i<result.data.length;i++){
                var ssName ="";
                var name =result.data[i].name;
                console.log(name);
                name.replace(" ","&nbsp;");
                console.log(name);
                var sName = name.split("\n");
                for(var j=0;j<sName.length;j++){
                    if(j==0){
                        ssName+= '<p style="font-size:14px;">'+sName[j]+'</p><p style="font-size:12px;">';
                    }
                    else if(j==(sName.length-1)){
                        ssName+= sName[j]+'</p>';
                    }
                    else{
                        ssName+= sName[j]+'</p><p style="font-size:12px;">';
                    }

                }
                result.data[i].name=ssName;
                console.log(sName);
                console.log(ssName);
            }
            var tpl = swig.renderFile('views/segment/team.html', {list: result.data});
            result.tpl = tpl;
            result.totalCount = totalCount;
            return res.send(result);
        });
    });
};

// 渲染 讲师详情页面
exports.renderone = function(req, res, next){
    var oData = [];
    var id = req.param('id');
    var sql = "SELECT id,name,is_active,cover_url,brief,created_date FROM `admin_team` WHERE id=?";

    mysql.query(sql, [id], function(result){
        oData.content = result.data[0].brief;
        
        var sql = "SELECT * FROM `admin_config` WHERE type='BASIC_SITE_TITLE'";
        mysql.query(sql, [], function(result){
            oData.site_title = result.data[0].value;

            res.render('content', oData);
        });
    });
}