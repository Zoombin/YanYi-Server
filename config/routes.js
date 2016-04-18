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

    // front end
    var core = require('../admin/core.server');

    // init default data
    app.get('/', core.common);

    // course
    app.get('/api/course/getall', core.course_getall);
    app.get('/course/:id?', core.course_renderone);

    // activity
    app.get('/api/activity/getall', core.activity_getall);
    app.get('/activity/:id?', core.activity_renderone);

    // team
    app.get('/api/team/getall', core.team_getall);

    // video
    app.get('/api/video/getall', core.video_getall);

    // stick
    app.get('/api/stick/getall', core.stick_getall);
    app.get('/stick/:id?', core.stick_renderone);


    // admin pages
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
    app.post('/admin/course/active', admin.course_active);
    app.post('/admin/course/remove', admin.course_remove);

    // admin video
    app.get('/admin/video/getall', admin.video_getall);
    app.post('/admin/video/add', admin.video_add);
    app.post('/admin/video/active', admin.video_active);
    app.post('/admin/video/remove', admin.video_remove);

    // admin activity
    app.get('/admin/activity/getall', admin.activity_getall);
    app.post('/admin/activity/add', admin.activity_add);
    app.post('/admin/activity/active', admin.activity_active);
    app.post('/admin/activity/remove', admin.activity_remove);

    // requirement msg
    app.post('/admin/requirement/add', admin.req_add);
    app.get('/admin/requirement/getall', admin.req_getall);

    // admin team
    app.get('/admin/team/getall', admin.team_getall);
    app.post('/admin/team/add', admin.team_add);
    app.post('/admin/team/active', admin.team_active);
    app.post('/admin/team/remove', admin.team_remove);

    // admin stick
    app.get('/admin/stick/getall', admin.stick_getall);
    app.post('/admin/stick/add', admin.stick_add);
    app.post('/admin/stick/active', admin.stick_active);
    app.post('/admin/stick/remove', admin.stick_remove);
};
