var Mongoose = require('mongoose');
var User = require('../models/User');
var Member = require('../models/Member');
var Visit = require('../models/Visit');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');






exports.listVisits= function (req, res, next) {
    var query = {deleted:false};
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
exports.isFrontDesk = function (req, res, next) {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'frontdesk')) return next();
    res.status(403).end();
};
