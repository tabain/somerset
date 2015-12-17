var Mongoose = require('mongoose');
var User = require('../models/User');
var Member = require('../models/Member');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');


var lists = {
    name: joi.string().optional(),
    wing: joi.objectId(),
    //organisation: joi.objectId().optional(),
    deleted: joi.boolean().default(false)

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