var Mongoose = require('mongoose');
var User = require('../models/User');
var PropOwner = require('../models/PropOwner');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');


var wingLocCreate = {
    location: joi.string().required(),
    wing: joi.objectId(),
    propOwner:joi.string().required(),
    phone:joi.string().optional(),
    ext:joi.string().optional(),
    email:joi.string().optional()
};



exports.listOwner = function (req, res, next) {
    PropOwner.find({deleted: false})
        .limit(req.query.limit ? req.query.limit : 30)
        .skip(req.query.offset ? req.query.offset : 0)
        .populate('wing')
        .populate('location')
        .exec(function (err, owners) {
            if (err) return next(err);
            var arr = [];
            owners.forEach(function (owner) {
                arr.push(owner.public());
            });
            res.json(arr);
        });
};

exports.createOwner = function (req, res, next) {

    var result = joi.validate(req.body, wingLocCreate,{stripUnknown: true});

    if (result.error) return res.status(400).json(result.error);

    PropOwner.create(result.value, function (err, owner) {
        if (err) return next(err);
        if (!owner) /*TODO: What to do*/ ;
        res.json(owner.public());
    });


};

exports.updateOwner = function (req, res, next) {

    var result = joi.validate(req.body, wingLocCreate, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    PropOwner.findOne({_id: req.params.propOwnerId}, function (err, owner) {
        if (err) return next(err);
        if (!owner) return res.status(404).json({message: 'User not found, invalid identifier'});
        var update = false;
        for (prop in result.value) {
            owner[prop] = result.value[prop];
            update = true;
        }
        if (update) owner.updatedBy = req.user._id;

        owner.save(function (err, owneru) {
            if (err) return next(err);
            res.json(owneru.public());
        });

    });

};

exports.deleteOwner = function (req, res, next) {

    PropOwner.findOne({_id: req.params.propOwnerId}, function (err, owner) {
        if (err) return next(err);
        if (!owner) return res.status(404).json({message: 'User not found, invalid identifier'});
        owner.deleted = true;
        owner.deletedAt = new Date();
        owner.deletedBy = req.user._id;

        owner.save(function (err, owneru) {
            if (err) return next(err);
            res.json(owneru.public());
        });

    });





};