var Mongoose = require('mongoose');
var User = require('../models/User');
var Member = require('../models/Member');
var Visit = require('../models/Visit');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');






exports.listVisits= function (req, res, next) {
    var query = {deleted:false};
    if (req.query.startdate && req.query.enddate){
        var startDate = moment(req.query.startdate).startOf('day').toDate();
        var endDate = moment(req.query.enddate).startOf('day').add(1, 'day').toDate();
        query.createdAt= {$gte: startDate, $lt: endDate};
    }
    if (req.query.wing) query.wing = req.query.wing;
    Visit.find(query)
        .limit(req.query.limit ? req.query.limit : 30)
        .skip(req.query.offset ? req.query.offset : 0)
        .populate(['wing', 'location', 'room', 'organisation', 'member', 'visitor'])
        .exec(function (err, visits) {
            if (err) return next(err);
            var arr = [];
            visits.forEach(function (visit) {
                arr.push(visit.public());
            });
            res.json(arr);
        });
};
var checkinorcheckout = {

    checkIn: joi.boolean().optional(),
    checkOut: joi.boolean().optional()


};
exports.updateVisit = function(req,res,next){
var result =  joi.validate(req.body, checkinorcheckout, {stripUnknown: true});
    Visit.findOne({_id: req.params.visitId}, function (err, visit) {
        if (err) return next(err);
        if (!visit) return res.status(404).json({message: 'Visit not found, invalid identifier'});

        if (result.value.checkIn === true) {

            if (visit.checkedOut !== false) {
                //TODO: throw error
            }

            if (!visit.checkedInAt || visit.checkedIn===false) {
                visit.checkedInBy = req.user._id;
                visit.checkedInAt = new Date();
                visit.checkedIn = true;
            }

        }

        if (result.value.checkOut === true) {

            if (visit.checkedIn !== true) {
                //TODO: throw error
            }

            if (!visit.checkedOutAt) {
                visit.checkedOutBy = req.user._id;
                visit.checkedOutAt = new Date();
                visit.checkedOut = true;

            }
        }

        var update = false;
        for (prop in result.value) {


            update = true;
        }

        if (update) visit.updatedBy = req.user._id;

        visit.save(function (err, newVisit) {
            if (err) return next(err);
            res.json(newVisit);
        });


    });
};

currentDate = function () {
    return new Date();
};
currentDate.description = 'todays date';

var reportV = {
    startdate: joi.date().default(currentDate),
    enddate: joi.date().min(joi.ref('startdate')).default(currentDate)
}
var reportHeaders = "First Name, " +
    "Last Name, " +
    "Phone, " +
    "Email, " +
    "Wing, " +
    "Wing Location, " +
    "Member name, " +
    "Member Org, " +
    "Lead Source, " +
    "Lead Status, " +
    "Description, " +
    "Checked In, " +
    "Checked Out";

var dFormat = 'YYYY-MM-DD';

exports.generateReport = function (req, res, next) {
    var result,
        filter = { deleted: false},
        name,
        residentName;
    if (req.query.startdate && req.query.enddate){
        result = joi.validate(req.query, reportV, {});
        if (result.error) return res.status(400).json(result.error);
        var startDate = moment(result.value.startdate).startOf('day').toDate();
        var endDate = moment(result.value.enddate).startOf('day').add(1, 'day').toDate();
        if (endDate <= startDate)
            endDate = moment(result.value.startdate).startOf('day').add(1, 'day').toDate();
        filter.createdAt= {$gte: startDate, $lt: endDate};

    }





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

        //
        //"Phone, " +
        //"Email, " +
        //"Wing, " +
        //"Wing Location, " +
        //"Member name, " +
        //"Member Org, " +
        //"Lead Source, " +
        //"Opt out Email, " +
        //"Marketing opt-in, " +
        //"Lead Status, " +
        //"Description, " +
        //"Checked In, " +
        //"Checked Out";



        var firstName = u.visitor.name.split(' ');
        var lastName = firstName[firstName.length - 1];

        firstName[firstName.length - 1] = '';
        firstName = firstName.join(' ');

        var comma = ', ';
        var newline = '\n';
        var leadStatus = 'Open';
        var system = 'Sommerset house guest sign in system';
        var desc = 'Day Guest';
        return firstName + comma +
            lastName + comma +
            formatPhoneNumber(u.visitor.phone) + comma +
            u.visitor.email + comma +
            u.wing.name + comma +
            u.location.location + comma +
            u.member.name + comma +
            u.organisation.name + comma +
            system + comma +
            //(!u.sendPromotions ? 'True' : 'False') + comma +
            //(u.sendPromotions ? 'True' : 'False') + comma +
            leadStatus + comma +
            desc + comma +
            formatTime(u.checkedInAt) + comma +
            formatTime(u.checkedOutAt) + newline;
    }

    var load_visit = function(){
        Visit.find(filter)
            .sort('createdAt')
            .populate(['wing', 'location', 'room', 'organisation', 'member', 'visitor'])
            .exec(function (err, visits) {
                var arr = [];
                if (err) return next(err);
                if (!visits || visits.length == 0) return res.status(404).json({message: 'invalid identifier'});


                var str = reportHeaders + '\n';
                visits.forEach(function (visit) {
                    str += userToCsv(visit);
                });

                res.setHeader('Content-disposition', 'attachment; filename=reports-' +
                moment(startDate).format(dFormat) + '-' +
                moment(endDate).format(dFormat) + '.csv');
                res.setHeader('Content-type', 'text/csv');
                res.send(new Buffer(str));





            });
    };
    load_visit();


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


exports.isFrontDesk = function (req, res, next) {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'frontdesk')) return next();
    res.status(403).end();
};
