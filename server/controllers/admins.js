var Mongoose = require('mongoose');
var User = require('../models/User');
var Visit = require('../models/Visit');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');
var ObjectId = Mongoose.Types.ObjectId;
var userV = {
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().regex(/[a-zA-Z0-9#]{8,30}/).required(),
    role: joi.string().valid('frontdesk').valid('admin').required(),
    //defaultLocation: joi.string().when('role', {is: 'frontdesk', then: joi.required(), otherwise: joi.optional()}),
    wing: joi.objectId()
};

var userU = {
    username: joi.string().optional(),
    email: joi.string().email().optional(),
    password: joi.string().regex(/[a-zA-Z0-9#]{8,30}/).optional(),
    role: joi.string().valid('frontdesk').valid('admin').optional(),
    //defaultLocation: joi.string().when('role', {is: 'frontdesk', then: joi.required(), otherwise: joi.optional()}),
    wing: joi.objectId()
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



exports.listUsers = function (req, res, next) {
    User.find({deleted: false})
        .limit(req.query.limit ? req.query.limit : 30)
        .skip(req.query.offset ? req.query.offset : 0)
        .populate('wing')
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
    wing: joi.objectId(),
    userId: joi.objectId()
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

    if (result.value.wing){
        match.wing = ObjectId(result.value.wing);
    }
    if (result.value.userId){
        match.updatedBy = ObjectId(result.value.userId);
    }
    Visit.aggregate([
        {
            $match: match
        },
        {
            $lookup: {
                from: "visitors",
                localField: "visitor",
                foreignField: "_id",as: "visitors"
            }
        },
        {
            $group: {
                _id: {
                    month: {
                        $month: "$createdAt"
                    }
                    ,day: {
                        $dayOfMonth: "$createdAt"
                    },
                    year: {
                        $year: "$createdAt"
                    },optin: "$visitors.sendPromotions"
                },count: {
                    $sum: 1
                }
            }
        }
    ], function (err, data) {
        if (err) return next(err);
        res.setHeader('Cache-Control', 'public, max-age=' + (60 * 5));
        res.json(data);
    })
};

