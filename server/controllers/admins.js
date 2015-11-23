var Mongoose = require('mongoose');
var User = require('../models/User');
var Guest = require('../models/Guest');
var NewGuest = require('../models/NewGuest');
var Visit = require('../models/Visit');
var Location = require('../models/Location');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');
var ObjectId = Mongoose.Types.ObjectId;
var userV = {
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().regex(/[a-zA-Z0-9#]{8,30}/).required(),
    role: joi.string().valid('frontdesk').valid('admin').required(),
    defaultLocation: joi.string().when('role', {is: 'frontdesk', then: joi.required(), otherwise: joi.optional()})
};

var userU = {
    username: joi.string().optional(),
    email: joi.string().email().optional(),
    password: joi.string().regex(/[a-zA-Z0-9#]{8,30}/).optional(),
    role: joi.string().valid('frontdesk').valid('admin').optional(),
    defaultLocation: joi.string().when('role', {is: 'frontdesk', then: joi.required(), otherwise: joi.optional()})
};

currentDate = function () {
    return new Date();
};
currentDate.description = 'todays date';

var reportV = {
    startdate: joi.date().default(currentDate),
    enddate: joi.date().min(joi.ref('startdate')).default(currentDate)
};

exports.isAdmin = function (req, res, next) {
    if (req.user && req.user.role === 'admin') return next();
    res.status(403).end();
};

exports.me = function (req, res, next) {
    if (req.user) {
        //setTimeout(function(){
        return res.json(req.user.public());
        //},3000);
    } else {
        res.status(403).end();
    }
};

exports.createUser = function (req, res, next) {

    var result = joi.validate(req.body, userV, {stripUnknown: true});

    if (result.error) return res.status(400).json(result.error);

    User.create(result.value, function (err, user) {
        if (err) return next(err);
        if (!user) /*TODO: What to do*/ ;
        res.json(user.public());
    });

        
};

var reportHeaders = "First Name, " +
    "Last Name, " +
    "Phone, " +
    "Email, " +
    "Building, " +
    "Lead Source, " +
    "About You, " +
    "Opt out Email, " +
    "Marketing opt-in, " +
    "Lead Status, " +
    "Description, " +
    "Checked In, " +
    "Checked Out";

var dFormat = 'YYYY-MM-DD';
var locs = [];
function getLocation(){
    Location.find(function(err, locations){
        if (err) return err;

        if (locations){
            locations.forEach(function(doc){

                locs.push(doc.public());
            });

        };
    });
};
getLocation();
exports.generateReport = function (req, res, next) {

    var result = joi.validate(req.query, reportV, {});
    if (result.error) return res.status(400).json(result.error);

    var startDate = moment(result.value.startdate).startOf('day').toDate();
    var endDate = moment(result.value.enddate).startOf('day').add(1, 'day').toDate();
    if (endDate <= startDate)
        endDate = moment(result.value.startdate).startOf('day').add(1, 'day').toDate();

    function formatTime(t) {
        if (!t) return '?';
        return moment(t).format('MMMM Do YYYY h:mm:ss a')
    }

    var stats = {valid: 0, invalid: 0, total: 0, plus44: 0, inter: 0, mobile: 0};
    var contains = function (m,it) {
        return m.indexOf(it) != -1;
    };
    var insert = function (m, index, string) {
        if (index > 0) return m.substring(0, index) + string + m.substring(index, m.length);
        else return string + m;
    };

    var formatPhoneNumber = function (p) {
        stats.total++;

        if (p.charAt(0) == '+' && contains(p, ' ')) {
            stats.valid++;
            return p;
        } else if (contains(p, '+44')) {
            stats.plus44++;
            return insert(p, 3, ' ');
        } else if (contains(p, '+')) {
            return insert(p, 3, ' ');
        } else if (p.indexOf('00') == 0) {
            stats.inter++;
            return formatPhoneNumber(p.replace(/^00/, '+'));
        } else if (p.indexOf('0') == 0) {
            stats.mobile++;
            return formatPhoneNumber(p.replace(/^0/, '+44'));
        } else {
            stats.invalid++;
            return p;
        }

    };


    function userToCsv(u) {
        var firstName = u.name.split(' ');
        var lastName = firstName[firstName.length - 1];

        firstName[firstName.length - 1] = '';
        firstName = firstName.join(' ');

        var comma = ', ';
        var newline = '\n';
        var leadStatus = 'Open';
        var system = 'Guest Sign In System';
        var desc = 'Day Guest';
        return firstName + comma +
            lastName + comma +
            formatPhoneNumber(u.phone) + comma +
            u.email + comma +
            u.location + comma +
            system + comma +
            u.type + comma +
            (!u.sendPromotions ? 'True' : 'False') + comma +
            (u.sendPromotions ? 'True' : 'False') + comma +
            leadStatus + comma +
            desc + comma +
            formatTime(u.checkedInAt) + comma +
            formatTime(u.checkedOutAt) + newline;
    }
    Visit.find({createdAt: {$gte: startDate, $lt: endDate}, deleted: false})
        .sort('createdAt')
        .exec(function (err, visits) {
            var arr = [];
            var arrV = [];
            if (err) return next(err);
            if (!visits || visits.length == 0) return res.status(404).json({message: 'invalid identifier'});
            visits.forEach(function(visit , i){
                NewGuest.findOne({_id : visit.guestId}, function(err, guest){
                    if (err) return next(err);
                    //visit.info = guest;
                    var locName;
                    if (!guest || guest === null || guest === undefined) {
                        arrV.push(visit);
                        return;
                    }
                    if (guest !=null){
                        locs.forEach(function(loc){
                            if (loc.id == visit.locationId) {
                                locName = loc.name;
                            }
                        });
                        var obj = {
                            id : visit._id,
                            guestId : visit.guestId,
                            location : locName,
                            residentName : visit.residentName,
                            company: visit.company || '',
                            roomNo : visit.roomNo || '',
                            event : visit.event || '',
                            type: visit.type,
                            name: guest.name,
                            phone: guest.phone,
                            email:guest.email,
                            plus18: guest.plus18 || false,
                            sendPromotions: visit.sendPromotions || false,
                            selfCheckIn: visit.selfCheckIn,
                            deleted : visit.delete,
                            deletedAt: visit.deletedAt,
                            deletedBy: visit.deletedBy,
                            checkedIn: visit.checkedIn,
                            checkedInAt: visit.checkedInAt,
                            checkedInBy: visit.checkedInBy,
                            checkedOut: visit.checkedOut,
                            checkedOutAt: visit.checkedOutAt,
                            checkedOutBy: visit.checkedOutBy,
                            updatedBy: visit.updatedBy
                        };

                        arr.push(obj);
                        if ((visits.length - arrV.length) == arr.length) {
                            var str = reportHeaders + '\n';
                            arr.forEach(function (ar) {
                                str += userToCsv(ar);
                            });
                            res.setHeader('Content-disposition', 'attachment; filename=reports-' +
                            moment(startDate).format(dFormat) + '-' +
                            moment(endDate).format(dFormat) + '.csv');
                            res.setHeader('Content-type', 'text/csv');
                            res.send(new Buffer(str));
                        }
                    }

                });

            });




        });
    //Guest.find({createdAt: {$gte: startDate, $lt: endDate}, deleted: false})
    //    .sort('createdAt')
    //    .exec(function (err, users) {
    //        if (err) return next(err);
    //        var str = reportHeaders + '\n';
    //        users.forEach(function (user) {
    //            str += userToCsv(user);
    //        });
    //
    //        res.setHeader('Content-disposition', 'attachment; filename=reports-' +
    //        moment(startDate).format(dFormat) + '-' +
    //        moment(endDate).format(dFormat) + '.csv');
    //        res.setHeader('Content-type', 'text/csv');
    //        res.send(new Buffer(str));
    //    });


};

exports.listUsers = function (req, res, next) {
    User.find({deleted: false})
        .limit(req.query.limit ? req.query.limit : 30)
        .skip(req.query.offset ? req.query.offset : 0)
        .exec(function (err, users) {
            if (err) return next(err);
            var arr = [];
            users.forEach(function (user) {
                arr.push(user.public());
            });
            res.json(arr);
        });
};

exports.updateUser = function (req, res, next) {

    var result = joi.validate(req.body, userU, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    User.findOne({_id: req.params.userId}, function (err, user) {
        if (err) return next(err);
        if (!user) return res.status(404).json({message: 'User not found, invalid identifier'});

        for (prop in result.value) {
            user[prop] = result.value[prop];
        }

        user.save(function (err, newUser) {
            if (err) return next(err);
            res.json(newUser.public());
        });

    });

};

exports.deleteUser = function (req, res, next) {

    User.findByIdAndUpdate(req.params.userId, { $set: { deleted: true }},function(err, user) {
        if (err) return next(err);
        if (!user) return res.status(404).json({message: 'User not found, invalid identifier'});


            if (err) return next(err);
            res.json(user);


    });

};


var usageV = {
    start: joi.date().default(currentDate),
    end: joi.date().min(joi.ref('start')).default(currentDate),
    locationId: joi.objectId()
};

exports.usageData = function (req, res, next) {

    var result = joi.validate(req.query, usageV, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    var match = {
        createdAt: {
            $gte: result.value.start,
            $lte: result.value.end
        },
        deleted: false
    };

    if (result.value.locationId){
        match.locationId = ObjectId(result.value.locationId);
    }

    Visit.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: {
                    month: {$month: "$createdAt"},
                    day: {$dayOfMonth: "$createdAt"},
                    year: {$year: "$createdAt"},
                    optin: "$sendPromotions"
                },
                count: {$sum: 1}
            }
        }
    ], function (err, data) {
        if (err) return next(err);
        res.setHeader('Cache-Control', 'public, max-age=' + (60 * 5));
        res.json(data);
    })
};