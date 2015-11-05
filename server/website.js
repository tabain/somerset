var express = require('express');
var website = express();
var config = require('../config/config');
var session = require('express-session');
var logger = require('../config/logger');
var db = require('../config/db');
var guests = require('./controllers/guests');
var locations = require('./controllers/locations');
var newGuests = require('./controllers/newGuests');
var admins = require('./controllers/admins');
var frontdesk = require('./controllers/frontdesk');
var newFrontdesk = require('./controllers/newFrontdesk');
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

website.post('/guests', [base.isSessionAvailable], guests.createGuest);
website.get('/locations', [base.isSessionAvailable], locations.getLocations);
website.post('/newGuests', [base.isSessionAvailable], newGuests.createGuest);
website.post('/visits', [base.isSessionAvailable], newGuests.createVisit);
website.post('/login', passport.authenticate('local'), admins.me);
website.post('/logout', base.logout);

website.get('/me', admins.me);

website.get('/users', [admins.isAdmin], admins.listUsers);
website.post('/users', [admins.isAdmin], admins.createUser);
website.put('/users/:userId', [admins.isAdmin], admins.updateUser);
website.delete('/users/:userId', [admins.isAdmin], admins.deleteUser);

website.get('/admins/newGuests', [newFrontdesk.isFrontDesk], newFrontdesk.listGuests);
website.put('/admins/newGuests/:visitId',[newFrontdesk.isFrontDesk],newFrontdesk.updateGuest);
website.delete('/admins/newGuests/:visitId', [frontdesk.isFrontDesk], newFrontdesk.deleteGuest);
website.get('/admins/guests', [frontdesk.isFrontDesk], frontdesk.listGuests);
website.post('/admins/guests', [frontdesk.isFrontDesk], frontdesk.createGuest);
website.put('/admins/guests/:guestId', [frontdesk.isFrontDesk], frontdesk.updateGuest);
website.put('/returning/guests/:guestId', frontdesk.updateGuest);

website.delete('/admins/guests/:guestId', [frontdesk.isFrontDesk], frontdesk.deleteGuest);


// Chart Data
website.get('/data/promotions', [admins.isAdmin], admins.usageData);

website.get('/reports', [frontdesk.isFrontDesk], admins.generateReport);

website.get('/', function (req, res, next) {
    req.session.isGuest = true;
    res.render('main', {});
});
website.get('/guests', guests.getGuest);
website.get('/newGuests', newGuests.getGuest);

website.get('*', function (req, res, next) {
    res.status(404).render('404', {});
});

website.use(base.logErrors);
website.use(base.clientErrorHandler);
website.use(base.errorHandler);

module.exports = website;