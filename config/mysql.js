var config = require('./config');
var mysql  = require('mysql');
var result = {error:0, msg:'',data:'', fields:''};

// get mysql connection
var db_config = {
  // connectionLimit : 10, //defauto to 10
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  port: config.mysql.port,
  database: config.mysql.database
}

var pool = null;
if(pool == null){
    pool  = mysql.createPool(db_config);
}

exports.query = function(sql, cb){
    pool.getConnection(function(err, con){
        if(err){
            result.error = 1;
            result.msg = err;
        }
        con.query(sql, function(err, rows, fields){
            result.data = rows;
            // result.fields = fields;
            con.release();
            cb(result);
        });
    });
}
