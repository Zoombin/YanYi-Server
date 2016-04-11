// admin user
exports.login = require('./api/admin_user').login;
exports.logout = require('./api/admin_user').logout;

// admin basic
exports.basic_getall = require('./api/basic').getall;
exports.basic_update = require('./api/basic').update;

// admin course
exports.course_getall = require('./api/course').getall;
exports.course_add = require('./api/course').add;
exports.course_active = require('./api/course').active;
exports.course_remove = require('./api/course').remove;
