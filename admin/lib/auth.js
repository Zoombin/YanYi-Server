exports.requiresLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    if (req.method === 'GET') {
        req.session.returnTo = req.originalUrl;
    }
    res.redirect('/admin/login');
};

exports.needGroup = function(group) {
    return [this.requiresLogin, function(req, res, next){
        if (req.user.group === 'superuser' || group === req.user.group) {
            next();
        } else {
            res.status(401).send('Unauthorized');
        }
    }];
};