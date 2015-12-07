var Mongoose = require('mongoose');
var User = require('../models/User');
var WingLocation = require('../models/WingLocation');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');


var wingLocCreate = {
    location: joi.string().required(),
    wing: joi.objectId()
};



exports.listWingLocs = function (req, res, next) {
    WingLocation.find({deleted: false})
        .limit(req.query.limit ? req.query.limit : 30)
        .skip(req.query.offset ? req.query.offset : 0)
        .populate('wing')
        .exec(function (err, winglocs) {
            if (err) return next(err);
            var arr = [];
            winglocs.forEach(function (wingLoc) {
                arr.push(wingLoc.public());
            });
            res.json(arr);
        });
};

exports.locByWing = function(req, res, next){

    WingLocation.find({wing: req.params.wingId, deleted: false}, function(err, locs){
        if (err) return next(err);
        var arr = [];
        if (locs.length == 0) return res.status(404).json({message: 'User not found, invalid identifier'})
        if (locs.length > 0) {
            locs.forEach(function(l){

                arr.push(l.public());

            });
            res.json(arr);
        }

    })


};

exports.createWingLoc = function (req, res, next) {

    var result = joi.validate(req.body, wingLocCreate, {stripUnknown: true});

    if (result.error) return res.status(400).json(result.error);

    WingLocation.create(result.value, function (err, wingLoc) {
        if (err) return next(err);
        if (!wingLoc) /*TODO: What to do*/ ;
        res.json(wingLoc.public());
    });


};

exports.updateWingLoc = function (req, res, next) {

    var result = joi.validate(req.body, wingLocCreate, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    WingLocation.findOne({_id: req.params.wingLocId}, function (err, wingLoc) {
        if (err) return next(err);
        if (!wingLoc) return res.status(404).json({message: 'User not found, invalid identifier'});
        var update = false;
        for (prop in result.value) {
            wingLoc[prop] = result.value[prop];
            update = true;
        }
        if (update) wingLoc.updatedBy = req.user._id;

        wingLoc.save(function (err, updateWingLoc) {
            if (err) return next(err);
            res.json(updateWingLoc.public());
        });

    });

};

exports.deleteWingLoc = function (req, res, next) {

    WingLocation.findOne({_id: req.params.wingLocId}, function (err, wingLoc) {
        if (err) return next(err);
        if (!wingLoc) return res.status(404).json({message: 'User not found, invalid identifier'});
        wingLoc.deleted = true;
        wingLoc.deletedAt = new Date();
        wingLoc.deletedBy = req.user._id;

        wingLoc.save(function (err, updateWingLoc) {
            if (err) return next(err);
            res.json(updateWingLoc.public());
        });

    });




    WingLocation.findByIdAndUpdate(req.params.wingLocId, { $set: { deleted: true }},function(err, wingLoc) {
        if (err) return next(err);
        if (!wingLoc) return res.status(404).json({message: 'User not found, invalid identifier'});


        if (err) return next(err);
        res.json(wingLoc);


    });

};