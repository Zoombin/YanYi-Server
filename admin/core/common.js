var mysql = require('../../config/mysql');
var swig = require('swig');
var aRes = {error:0, msg:'',data:Array()};

exports.common = function (req, res, next) {
    var oData = [];
    // get website title
    var sql = "SELECT * FROM `admin_config` WHERE type='BASIC_SITE_TITLE'";
    mysql.query(sql, [], function(result){
        oData.site_title = result.data[0].value;

        res.render('index', oData);
    });
};