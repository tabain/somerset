var config = require('./config');
var mongoose = require('mongoose');
var logger = require('./logger');
var User = require('../server/models/User');
var Location = require('../server/models/Location');

var superadmin = {
    email: 'admin@erlystage.com',
    password: 'erly123#',
    username: 'Super Admin',
    role: 'admin',
    permissions: ['manage', 'frontdesk']
};

var front = {
    email: 'front@erlystage.com',
    password: 'grey123#',
    username: 'Front Desk User',
    role: 'frontdesk',
    permissions: ['frontdesk']
};

logger.info('connecting to mongodb ... ');
mongoose.connect(config.getDbConnectionString(), function (err) {
    if (err) throw err;
    logger.info('connected to mongodb.');
    createDefaultUsers();
});

mongoose.set('debug', config.debug);

function createDefaultUsers() {
    User.findOne({email: superadmin.email}).exec(function (err, model) {
        // TODO: should not create default user when someone deleted superadmin
        if (model) return;
        if (err) /*Continue and create a user*/;

        User.create(superadmin, function (err, user) {
            // In any case continue on
        });
    });

    User.findOne({email: front.email}).exec(function (err, model) {
        // TODO: should not create default user when someone deleted superadmin
        if (model) return;
        if (err) /*Continue and create a user*/;

        User.create(front, function (err, user) {
            // In any case continue on
        });
    })
}


module.exports = {
    mongoose: mongoose,
    reset: function () {
        //TODO: add reset function
    }
};


// TODO: Load models and Export Models?
// TODO: Load




