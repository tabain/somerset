var express = require('express');
var website = express();
var config = require('../config/config');
var session = require('express-session');
var logger = require('../config/logger');
var db = require('../config/db');
var admins = require('./controllers/admins');
var wings = require('./controllers/wings');
var wingLocs = require('./controllers/wingLocations');
var wingRooms = require('./controllers/wingLocRooms');
var orgs = require('./controllers/organisations');
var members = require('./controllers/members');
var clients = require('./controllers/clients');
var frontdesks = require('./controllers/frontdesks');
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
//users
website.get('/users', [admins.isAdmin], admins.listUsers);
website.post('/users', [admins.isAdmin], admins.createUser);
website.put('/users/:userId', [admins.isAdmin], admins.updateUser);
website.delete('/users/:userId', [admins.isAdmin], admins.deleteUser);
//wings
website.get('/wings', [base.isSessionAvailable], wings.listWings);
website.post('/wings', [admins.isAdmin], wings.createWing);
website.put('/wings/:wingId', [admins.isAdmin], wings.updateWing);
website.delete('/wings/:wingId', [admins.isAdmin], wings.deleteWing);
//winglocations
website.get('/winglocs', [admins.isAdmin], wingLocs.listWingLocs);
website.get('/winglocs/:wingId', [admins.isAdmin], wingLocs.locByWing);
website.post('/winglocs', [admins.isAdmin], wingLocs.createWingLoc);
website.put('/winglocs/:wingLocId', [admins.isAdmin], wingLocs.updateWingLoc);
website.delete('/winglocs/:wingLocId', [admins.isAdmin], wingLocs.deleteWingLoc);


//wingRooms
website.get('/rooms', [admins.isAdmin], wingRooms.listRooms);
website.get('/rooms/:locationId', [admins.isAdmin], wingRooms.roombyloc);
website.post('/rooms', [admins.isAdmin], wingRooms.createRoom);
website.put('/rooms/:roomId', [admins.isAdmin], wingRooms.updateRoom);
website.delete('/rooms/:roomId', [admins.isAdmin], wingRooms.deleteRoom);

//Organisation
website.get('/orgs', [admins.isAdmin], orgs.listOrgs);
website.get('/orgs/:roomId', [admins.isAdmin], orgs.orgbyroom);
website.post('/orgs', [admins.isAdmin], orgs.createOrg);
website.put('/orgs/:orgId', [admins.isAdmin], orgs.updateOrg);
website.delete('/orgs/:orgId', [admins.isAdmin], orgs.deleteOrg);

//Member
website.get('/members', [admins.isAdmin], members.listMembers);
website.post('/members', [admins.isAdmin], members.createMember);
website.put('/members/:memberId', [admins.isAdmin], members.updateMember);
website.put('/selfaccepted/:visitId', [admins.isAdmin], members.updateMember);
website.delete('/members/:memberId', [admins.isAdmin], members.deleteMember);

//frontdesk
website.get('/visits', [frontdesks.isFrontDesk], frontdesks.listVisits);
website.get('/fmembers', [frontdesks.isFrontDesk], frontdesks.getMBW);
website.put('/visits/:visitId', [frontdesks.isFrontDesk], frontdesks.updateVisit);


//client side routes


website.get('/clientMembers', [base.isSessionAvailable], clients.listMembers);
website.get('/clientWings', [base.isSessionAvailable], wings.listWings);
website.post('/guests', [base.isSessionAvailable], clients.createVisitor);
website.get('/guests/:visitId', [base.isSessionAvailable], clients.findoneVisit);
website.get('/selfaccepted/:visitId', clients.updateVisit);

//website.get('/locations', [base.isSessionAvailable], locations.getLocations);
//website.post('/newGuests', [base.isSessionAvailable], newGuests.createGuest);
//website.post('/visits', [base.isSessionAvailable], newGuests.createVisit);



// Chart Data
//website.get('/data/promotions', [admins.isAdmin], admins.usageData);

website.get('/reports', [frontdesks.isFrontDesk], frontdesks.generateReport);

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