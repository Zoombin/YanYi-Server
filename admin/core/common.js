var mysql = require('../../config/mysql');
var swig = require('swig');
var aRes = {error:0, msg:'',data:Array()};

exports.common = function (req, res, next) {
    var oData = [];
    // load lang
    var lang = req.param('lang');
    if(!lang) lang = 'zh_cn';
    var lang_json = require('../lang/' + lang +'.json')
    oData.lang = lang_json;
    oData.lang_value = lang;
    // get website title
    var sql = "SELECT * FROM `admin_config` WHERE type='BASIC_SITE_TITLE'";
    mysql.query(sql, [], function(result){
        oData.site_title = result.data[0].value;

        res.render('index', oData);
    });
};