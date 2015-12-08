var Mongoose = require('mongoose');
var User = require('../models/User');
var Organisation = require('../models/Organisation');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');


var Create = {
    name: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string().required(),
    mobile: joi.string().required(),
    fax: joi.string().required(),
    ext: joi.string().required(),
    room: joi.objectId(),
    wing: joi.objectId(),
    location: joi.objectId()
};



exports.listOrgs= function (req, res, next) {
    Organisation.find({deleted: false})
        .limit(req.query.limit ? req.query.limit : 30)
        .skip(req.query.offset ? req.query.offset : 0)
        .populate(['wing', 'location', 'room'])
        .exec(function (err, orgs) {
            if (err) return next(err);
            var arr = [];
            orgs.forEach(function (org) {
                arr.push(org.public());
            });
            res.json(arr);
        });
};
exports.createOrg = function (req, res, next) {

    var result = joi.validate(req.body, Create, {stripUnknown: true});

    if (result.error) return res.status(400).json(result.error);

    Organisation.create(result.value, function (err, org) {
        if (err) return next(err);
        if (!org) /*TODO: What to do*/ ;
        res.json(org.public());
    });


};
