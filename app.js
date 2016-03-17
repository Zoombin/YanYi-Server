var express = require('express');
var config = require('./config/config');
var mysql  = require('mysql');
var app = express();
var fs = require('fs');
var path = require('path');

// Connect to mysql
var db_config = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  port: config.mysql.port,
  database: config.mysql.database
}

var connection;
var connect = function(){
  connection = mysql.createConnection(db_config);
  connection.connect(function(err){
    if(err){
      console.log('re-connect: ' + new Date());
      setTimeout(connect, 2000);   //2秒重连一次
      return;
    }
    console.log('mysql connect success'); 
  });

  connection.on('error', function(err){
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST'){
      connect();
    }else{
      throw err;
    }
  });
}
connect();

// Bootstrap application settings
require('./config/express')(app);

// Bootstrap routes
require('./config/routes')(app);


app.listen(config.Port, function() {
    console.log('Listening on port %d', config.Port);
});
