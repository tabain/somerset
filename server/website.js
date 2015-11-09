var express = require('express');
var website = express();
var config = require('../config/config');
var session = require('express-session');
var logger = require('../config/logger');
var db = require('../config/db');
var admins = require('./controllers/admins');
var base = require('./controllers/base');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
require('../config/auth')(passport);

website.set('trust proxy', true);
website.set('views', config.viewPath());
website.set('view engine', 'jade');

var sess = {
    secret: 'keyboard cat',
    name: 'user',
    cookie: {},
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: db.mongoose.connection})
};

website.use(express.static(config.getPublicPath()));
website.use(session(sess));

website.use(passport.initialize());
website.use(passport.session());


website.post('/login', passport.authenticate('local'), admins.me);
website.post('/logout', base.logout);

website.get('/me', admins.me);

website.get('/users', [admins.isAdmin], admins.listUsers);
website.post('/users', [admins.isAdmin], admins.createUser);
website.put('/users/:userId', [admins.isAdmin], admins.updateUser);
website.delete('/users/:userId', [admins.isAdmin], admins.deleteUser);


// Chart Data
//website.get('/data/promotions', [admins.isAdmin], admins.usageData);

//website.get('/reports', [frontdesk.isFrontDesk], admins.generateReport);

website.get('/', function (req, res, next) {
    req.session.isGuest = true;
    res.render('main', {});
});


website.get('*', function (req, res, next) {
    res.status(404).render('404', {});
});

website.use(base.logErrors);
website.use(base.clientErrorHandler);
website.use(base.errorHandler);

module.exports = website;