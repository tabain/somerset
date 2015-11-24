var Mongoose = require('mongoose');
var User = require('../models/User');
var Wing = require('../models/Wing');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');
var ObjectId = Mongoose.Types.ObjectId;


var wingCreate = {
    name: joi.string().required()
};



exports.listWings = function (req, res, next) {
    Wing.find({deleted: false})
        .limit(req.query.limit ? req.query.limit : 30)
        .skip(req.query.offset ? req.query.offset : 0)
        .exec(function (err, wings) {
            if (err) return next(err);
            var arr = [];
            wings.forEach(function (wing) {
                arr.push(wing.public());
            });
            res.json(arr);
        });
};
exports.createWing = function (req, res, next) {

    var result = joi.validate(req.body, wingCreate, {stripUnknown: true});

    if (result.error) return res.status(400).json(result.error);

    Wing.create(result.value, function (err, wing) {
        if (err) return next(err);
        if (!wing) /*TODO: What to do*/ ;
        res.json(wing.public());
    });


};

exports.updateWing = function (req, res, next) {

    var result = joi.validate(req.body, wingCreate, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    Wing.findOne({_id: req.params.wingId}, function (err, wing) {
        if (err) return next(err);
        if (!wing) return res.status(404).json({message: 'User not found, invalid identifier'});

        for (prop in result.value) {
            wing[prop] = result.value[prop];
        }

        wing.save(function (err, updatewing) {
            if (err) return next(err);
            res.json(updatewing.public());
        });

    });

};

exports.deleteWing = function (req, res, next) {

    Wing.findByIdAndUpdate(req.params.wingId, { $set: { deleted: true }},function(err, wing) {
        if (err) return next(err);
        if (!wing) return res.status(404).json({message: 'User not found, invalid identifier'});


        if (err) return next(err);
        res.json(wing);


    });

};