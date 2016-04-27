exports.common = require('./core/common').common;

// event
exports.events = require('./core/events').getpage;
exports.event_getall = require('./core/events').getall;

// banner
exports.banner_getall = require('./core/banner').getall;

// course
exports.course_getall = require('./core/course').getall;
exports.course_renderone = require('./core/course').renderone;

// activity
exports.activity_getall = require('./core/activity').getall;
exports.activity_renderone = require('./core/activity').renderone;

// team
exports.team_getall = require('./core/team').getall;

// video
exports.video_getall = require('./core/video').getall;

// stick
exports.stick_getall = require('./core/stick').getall;
exports.stick_renderone = require('./core/stick').renderone;