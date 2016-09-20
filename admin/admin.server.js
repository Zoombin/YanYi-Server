// admin user
exports.login = require('./api/admin_user').login;
exports.logout = require('./api/admin_user').logout;

// admin basic
exports.basic_getall = require('./api/basic').getall;
exports.basic_update = require('./api/basic').update;

// admin banner
exports.banner_getall = require('./api/banner').getall;
exports.banner_add = require('./api/banner').add;
exports.banner_active = require('./api/banner').active;
exports.banner_remove = require('./api/banner').remove;

// admin course
exports.course_draft = require('./api/course').draft;
exports.course_getall = require('./api/course').getall;
exports.course_add = require('./api/course').add;
exports.course_active = require('./api/course').active;
exports.course_remove = require('./api/course').remove;

// admin service
exports.service_getall = require('./api/service').getall;
exports.service_add = require('./api/service').add;

// admin video
exports.video_getall = require('./api/video').getall;
exports.video_add = require('./api/video').add;
exports.video_active = require('./api/video').active;
exports.video_remove = require('./api/video').remove;

// admin activity
exports.activity_getall = require('./api/activity').getall;
exports.activity_add = require('./api/activity').add;
exports.activity_active = require('./api/activity').active;
exports.activity_remove = require('./api/activity').remove;

// requirement msg, home page
exports.req_add = require('./api/requirement').add;
exports.req_getall = require('./api/requirement').getall;
exports.req_exportexcel = require('./api/requirement').exportexcel;
exports.req_downloadexcel = require('./api/requirement').downloadexcel;

// admin team
exports.team_getall = require('./api/team').getall;
exports.team_add = require('./api/team').add;
exports.team_active = require('./api/team').active;
exports.team_remove = require('./api/team').remove;

// admin stick
exports.stick_getall = require('./api/stick').getall;
exports.stick_add = require('./api/stick').add;
exports.stick_active = require('./api/stick').active;
exports.stick_remove = require('./api/stick').remove;

// admin event
exports.event_getall = require('./api/event').getall;
exports.event_add = require('./api/event').add;
exports.event_active = require('./api/event').active;
exports.event_remove = require('./api/event').remove;