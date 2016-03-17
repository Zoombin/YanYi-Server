var express = require('express'),
    config = require('./config'),
    swig = require('swig'),
    pkg = require('../package.json');

module.exports = function (app) {
    swig.setDefaults({ varControls: ['{$', '$}'] });
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', config.root + '/views');
    // app.use(favicon(config.clientRoot + '/favicon.ico'));
    app.use(express.compress());
    app.use(express.favicon());
    app.use(express.static(config.clientRoot));
    app.use(express.methodOverride());
    app.use(express.cookieParser())
    app.use(express.session({secret: pkg.name, cookie: { maxAge: 15*60*1000 }}));
    app.use(express.bodyParser());

    app.disable('x-powered-by');

    app.use(function(req, res, next) {
        res.locals.user = req.user;
        next();
    });
};