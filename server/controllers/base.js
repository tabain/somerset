var logger = require('../../config/logger');

exports.isSessionAvailable = function (req, res, next) {
    if (req.session.isGuest === true) {
        next();
    } else {
        res.status(403).json({ msg:'Unauthorized to create a guest, please go back to homepage'});
    }
};

exports.logout = function (req, res, next) {
    req.logout();
    res.send(200);
};

exports.logErrors = function (err, req, res, next) {
    logger.error(err.stack);
    next(err);
};

exports.clientErrorHandler = function (err, req, res, next) {
    var acceptsJSON = req.accepts('json');
    if (acceptsJSON) {
        res.status(500).json(err);
    } else {
        
        next(err);
    }
};

exports.errorHandler = function (err, req, res, next) {
    res.status(500);
    res.render('error', {error: err});
};