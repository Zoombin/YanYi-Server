var auth = require('../admin/lib/auth'),
    config = require('./config')
;
// var csrf = require('csurf');
var config = require('./config');

module.exports = function(app, passport) {

    app.use(function(req, res, next) {
        // console.log('Request: ', req.originalUrl);
        res.locals.cdn = config.cdn;
        next();
    });

    // default index views
    app.get('/', function(req, res) {
        res.render('index');
    });

    // // admin pages
    // var admin = require('../admin/admin.server');
    // app.get('/admin/login', function(req, res){
    //     // console.log(req.user);
    //     res.render('admin/login');
    // });
    // app.get('/admin/logout', admin.logout);
    // app.get('/admin', auth.requiresLogin, function(req, res){
    //     res.render('admin/index');
    // });

    // // grab pages
    // app.get('/admin/postdata',function(req, res){
    //     res.render('admin/grab/postdata');
    // }); 
    
};
