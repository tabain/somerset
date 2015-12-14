var Mongoose = require('mongoose');
var User = require('../models/User');
var Member = require('../models/Member');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');


var Create = {
    name: joi.string().required(),
    age: joi.Number().required(),
    email: joi.string().required(),
    phone: joi.string().required(),
    mobile: joi.string(),
    ext: joi.string(),
    room: joi.objectId(),
    wing: joi.objectId(),
    location: joi.objectId(),
    organisation: joi.objectId()
};



exports.listMembers= function (req, res, next) {
    Member.find({deleted: false})
        .limit(req.query.limit ? req.query.limit : 30)
        .skip(req.query.offset ? req.query.offset : 0)
        .populate(['wing', 'location', 'room', 'organisation'])
        .exec(function (err, members) {
            if (err) return next(err);
            var arr = [];
            members.forEach(function (member) {
                arr.push(member.public());
            });
            res.json(arr);
        });
};

exports.createMember = function (req, res, next) {

    var result = joi.validate(req.body, Create, {stripUnknown: true});

    if (result.error) return res.status(400).json(result.error);

    Member.create(result.value, function (err, member) {
        if (err) return next(err);
        if (!member) /*TODO: What to do*/ ;
        res.json(member.public());
    });


};

exports.updateMember = function (req, res, next) {

    var result = joi.validate(req.body, Create, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    Member.findOne({_id: req.params.memberId}, function (err, member) {
        if (err) return next(err);
        if (!member) return res.status(404).json({message: 'Member not found, invalid identifier'});
        var update = false;
        for (prop in result.value) {
            member[prop] = result.value[prop];
            update = true;
        }
        if (update) member.updatedBy = req.user._id;

        member.save(function (err, umember) {
            if (err) return next(err);
            res.json(umember.public());
        });

    });

};

exports.deleteMember = function (req, res, next) {

    Member.findOne({_id: req.params.memberId}, function (err, member) {
        if (err) return next(err);
        if (!member) return res.status(404).json({message: 'Organisation not found, invalid identifier'});
        member.deleted = true;
        member.deletedAt = new Date();
        member.deletedBy = req.user._id;

        member.save(function (err, dmember) {
            if (err) return next(err);
            res.json(dmember.public());
        });

    });


};