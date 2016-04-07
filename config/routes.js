var auth = require('../admin/lib/auth'),
    config = require('./config')
;
// var csrf = require('csurf');
var config = require('./config');

module.exports = function(app, passport) {

    app.use(function(req, res, next) {
        res.locals.cdn = config.cdn;
        next();
    });

    // default index views
    app.get('/', function(req, res) {
        res.render('index');
    });

    // // admin pages
    var admin = require('../admin/admin.server');
    app.get('/admin/login', function(req, res){
        res.render('admin/login');
    });
    app.get('/admin/logout', admin.logout);
    app.get('/admin', auth.requiresLogin, function(req, res){
        res.render('admin/index');
    });

    // admin API
    app.post('/admin/login', admin.login);
    
    // admin basic
    app.get('/admin/basic/getall', admin.basic_getall);
    app.post('/admin/basic/update', admin.basic_update);

    // admin course
    app.get('/admin/course/getall', admin.course_getall);
    app.post('/admin/course/add', admin.course_add);
    // app.all('/admin/course/ue', admin.course_ue);
};
