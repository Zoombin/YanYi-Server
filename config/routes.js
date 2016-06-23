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
    app.get('/lang/:lang?', core.common);

    // event
    app.get('/event', core.events);
    app.get('/api/event/getall', core.event_getall);

    // banner
    app.get('/api/banner/getall', core.banner_getall);

    // course
    app.get('/api/course/getall', core.course_getall);
    app.get('/course/:id?', core.course_renderone);

    // service
    app.get('/service/:id?', core.service_renderone);

    // activity
    app.get('/api/activity/getall', core.activity_getall);
    app.get('/activity/:id?', core.activity_renderone);

    // team
    app.get('/api/team/getall', core.team_getall);
    app.get('/team/:id?', core.team_renderone);

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

    // admin banner
    app.get('/admin/banner/getall', admin.banner_getall);
    app.post('/admin/banner/add', admin.banner_add);
    app.post('/admin/banner/active', admin.banner_active);
    app.post('/admin/banner/remove', admin.banner_remove);

    // admin course
    app.get('/admin/course/getall', admin.course_getall);
    app.post('/admin/course/add', admin.course_add);
    app.post('/admin/course/active', admin.course_active);
    app.post('/admin/course/remove', admin.course_remove);

    // admin service
    app.get('/admin/service/getall', admin.service_getall);
    app.post('/admin/service/add', admin.service_add);

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
    app.get('/admin/requirement/exportexcel', admin.req_exportexcel);
    app.get('/admin/requirement/downloadexcel', admin.req_downloadexcel);

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

    // admin event
    app.get('/admin/event/getall', admin.event_getall);
    app.post('/admin/event/add', admin.event_add);
    app.post('/admin/event/active', admin.event_active);
    app.post('/admin/event/remove', admin.event_remove);
};
