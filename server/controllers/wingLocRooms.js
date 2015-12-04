var Mongoose = require('mongoose');
var User = require('../models/User');
var WingLocationRoom = require('../models/WingLocationRoom');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');


var Create = {
    room: joi.string().required(),
    wing: joi.objectId(),
    location: joi.objectId()
};



exports.listRooms = function (req, res, next) {
    WingLocationRoom.find({deleted: false})
        .limit(req.query.limit ? req.query.limit : 30)
        .skip(req.query.offset ? req.query.offset : 0)
        .populate(['wing', 'location'])
        .exec(function (err, rooms) {
            if (err) return next(err);
            var arr = [];
            rooms.forEach(function (room) {
                arr.push(room.public());
            });
            res.json(arr);
        });
};
exports.createRoom = function (req, res, next) {

    var result = joi.validate(req.body, Create, {stripUnknown: true});

    if (result.error) return res.status(400).json(result.error);

    WingLocationRoom.create(result.value, function (err, room) {
        if (err) return next(err);
        if (!room) /*TODO: What to do*/ ;
        res.json(room.public());
    });


};

exports.updateRoom = function (req, res, next) {

    var result = joi.validate(req.body, Create, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    WingLocationRoom.findOne({_id: req.params.roomId}, function (err, room) {
            if (err) return next(err);
            if (!room) return res.status(404).json({message: 'User not found, invalid identifier'});
            var update = false;
            for (prop in result.value) {
                room[prop] = result.value[prop];
                update = true;
        }
        if (update) room.updatedBy = req.user._id;

        room.save(function (err, uroom) {
            if (err) return next(err);
            res.json(uroom.public());
        });

    });

};

exports.deleteRoom = function (req, res, next) {

    WingLocationRoom.findOne({_id: req.params.roomId}, function (err, room) {
        if (err) return next(err);
        if (!room) return res.status(404).json({message: 'User not found, invalid identifier'});
        room.deleted = true;
        room.deletedAt = new Date();
        room.deletedBy = req.user._id;

        room.save(function (err, uroom) {
            if (err) return next(err);
            res.json(uroom.public());
        });

    });


};