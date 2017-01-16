var mysql = require('../../config/mysql');
var swig = require('swig');
var aRes = {error:0, msg:'',data:Array()};

var badge = ['warning','danger','info','success','primary'];
// 渲染 event页面
exports.getpage = function(req, res, next){
    var oData = [];
    // load lang
    var lang = req.param('lang');
    if(!lang) lang = 'zh_cn';
    var lang = require('../lang/' + lang +'.json')
    oData.lang = lang;
    oData.current_year = new Date().getFullYear();
    // get website title
    var sql = "SELECT * FROM `admin_config` WHERE type='BASIC_SITE_TITLE'";
    mysql.query(sql, [], function(result){
        oData.site_title = result.data[0].value;

        res.render('events', oData);
    });
}

exports.getall = function (req, res, next) {
    var sStartDate = req.param('start_date');
    var sCurDate = req.param('cur_date');

    // var sql = "SELECT * FROM `admin_event` WHERE event_date BETWEEN ? AND ? ORDER BY event_date DESC";
    var sql = "SELECT * FROM `admin_event` WHERE event_date >= ? ORDER BY event_date";

    // 获取今年所有的活动
    mysql.query(sql, [sStartDate/*,sCurDate*/], function(result){
        var curYearData = result.data;
        // 只显示未来的活动
        mysql.query(sql, [/*sStartDate,*/sCurDate], function(result){
            var tpl = swig.renderFile('views/segment/event.html', {list: result.data});
            result.tpl = tpl;
            result.curYearData = curYearData;
            return res.send(result);
        });
    });
};

// 渲染 event页面
exports.renderone = function(req, res, next){
    var oData = [];
    var id = req.param('id');
    var sql = "SELECT * FROM `admin_activity` WHERE id=?";

    mysql.query(sql, [id], function(result){
        oData.content = result.data[0].content;
        
        var sql = "SELECT * FROM `admin_config` WHERE type='BASIC_SITE_TITLE'";
        mysql.query(sql, [], function(result){
            oData.site_title = result.data[0].value;

            res.render('content', oData);
        });
    });
}


//额外提供的接口客户
exports.event_info = function (req, res, next) {
    var aRes = {error:0, msg:'',data:{}};
    var param=[];
    var sStartDate = req.param('start_date');
    var id = req.param('id');

    if(!sStartDate){
        aRes.error=1;
        aRes.msg="请输入开始时间";
        return res.send(aRes);
    }

    var sql = "SELECT * FROM `admin_event` WHERE event_date >= ?";
    param.push(sStartDate);
    if(id){
        sql += " AND id=? ";
        param.push(id);
    }
    sql += "ORDER BY event_date";


    mysql.query(sql, param, function(result){
        if(result.data.length){
            if(id){
                aRes.data=result.data[0];
            }
            else{
                aRes.data=result.data;
            }
        }
        else{
            aRes.error=1;
            aRes.msg="该活动不存在";
        }
        return res.send(aRes);
    });



};