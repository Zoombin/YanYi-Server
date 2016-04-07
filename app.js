var express = require('express');
var config = require('./config/config');
var app = express();

// ueditor
require('./config/ueditor')(app);

// Bootstrap application settings
require('./config/express')(app);

// Bootstrap routes
require('./config/routes')(app);

app.listen(config.Port, function() {
    console.log('Listening on port %d', config.Port);
});
