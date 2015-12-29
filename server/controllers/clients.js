var Mongoose = require('mongoose');
var User = require('../models/User');
var Member = require('../models/Member');
var Visitor = require('../models/Visitor');
var Visit = require('../models/Visit');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');


var lists = {
    name: joi.string().optional(),
    wing: joi.objectId(),
    //organisation: joi.objectId().optional(),
    deleted: joi.boolean().default(false)

},
    createVisitor = {
        name: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/).required(),
        phone: joi.string().regex(/^[\+]?(?:[0-9] ?){6,14}[0-9]$/).required(),
        mobile: joi.string().optional(),
        email: joi.string().email().required(),
        age: joi.number().required()
    },
    createVisit = {
        member: joi.objectId(),
        visitor: joi.objectId(),
        room: joi.objectId(),
        wing: joi.objectId(),
        location: joi.objectId(),
        organisation: joi.objectId(),
        accepted : joi.boolean().default(false)
    };


exports.listMembers= function (req, res, next) {
    var squery,r;
    var result = joi.validate(req.query, lists, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);
    squery = result.value;
    if (result.value.name){
        squery.name = new RegExp(result.value.name.toLowerCase(), 'i');
    }


    Member.find(squery)
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
    //
    //loadMembers = function(){

    //};

};


exports.createVisitor = function(req, res, next){
    var result = joi.validate(req.body, createVisitor, {stripUnknown: true});

    if (result.error) return res.status(400).json(result.error);

    Visitor.create(result.value, function (err, visitor) {
        if (err) return next(err);
        if (!visitor) /*TODO: What to do*/ ;
        if (visitor){
            var obj = {
                member: req.body.member,
                visitor: visitor.id,
                room: req.body.room,
                wing: req.body.wing,
                location: req.body.location,
                organisation: req.body.organisation
            };
            createVisit(obj);
        }

    });

    function createVisit(obj){
        var result = joi.validate(obj, createVisit, {stripUnknown: true});

        if (result.error) return res.status(400).json(result.error);

        Visit.create(result.value, function(err, visit){
            if (err) return next(err);
            if (!visit) return res.status(400).json(result.error);
            if (visit) {
                res.json(visit.public());
            }
        });
    };
};

