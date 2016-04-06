var express = require('express');
var config = require('./config/config');
var mysql  = require('mysql');
var app = express();
var fs = require('fs');
var path = require('path');

// Bootstrap application settings
require('./config/express')(app);

// Bootstrap routes
require('./config/routes')(app);

// ueditor
require('./config/ueditor')(app);


app.listen(config.Port, function() {
    console.log('Listening on port %d', config.Port);
});
