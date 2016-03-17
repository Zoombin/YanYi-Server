// configuration file
var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var pkg = require(rootPath + '/package.json');

module.exports = {
    root: rootPath,
    adminRoot: rootPath + '/admin',
    clientRoot: rootPath + '/public',
    Port: 3000,
    mysql: {
        host: 'localhost',
        user: 'root',
        password: '',
        port: '3306',
        database: 'yanyi'
    },
    app: {
        name: process.env.NODE_ENV === 'production' ? pkg.name + ' (' + pkg.version + ')' : pkg.name + ' [' + pkg.version + ']',
        version: pkg.version,
        description: pkg.description
    },
    cdn: {
        js: {
            jquery: 'http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js',
            bootstrap: 'http://cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js',
            plupload: 'http://cdn.bootcss.com/plupload/2.1.7/plupload.full.min.js',
            pluploadzhcn: 'http://cdn.bootcss.com/plupload/2.1.7/i18n/zh_CN.js',
        },
        css: {
            bootstrap: 'http://cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css',
        }
    },
    projectname: 'YanYi-Web'
};

