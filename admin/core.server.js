exports.common = require('./core/common').common;

// event
exports.events = require('./core/events').getpage;
exports.event_getall = require('./core/events').getall;
exports.event_info = require('./core/events').event_info;

// banner
exports.banner_getall = require('./core/banner').getall;

// course
exports.course_getall = require('./core/course').getall;
exports.course_renderone = require('./core/course').renderone;

// service
exports.service_renderone = require('./core/service').renderone;

// activity
exports.activity_getall = require('./core/activity').getall;
exports.activity_renderone = require('./core/activity').renderone;

// team
exports.team_getall = require('./core/team').getall;
exports.team_renderone = require('./core/team').renderone;

// video
exports.video_getall = require('./core/video').getall;

// stick
exports.stick_getall = require('./core/stick').getall;
exports.stick_renderone = require('./core/stick').renderone;