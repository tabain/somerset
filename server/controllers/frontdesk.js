var Guest = require('../models/Guest');
var User = require('../models/User');
var joi = require('joi');
var moment = require('moment');

var guestV = {
    name: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/).required(),
    phone: joi.string().regex(/^[\+]?(?:[0-9] ?){6,14}[0-9]$/).required(),
    email: joi.string().email().required(),
    residentName: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/),
    roomNo: joi.string(),
    companyName: joi.string(),
    eventName: joi.string(),
    location: joi.string().valid(['SpitalFields', 'Kings Cross', 'King\'s Cross', 'Notting Hill']).insensitive().required(),
    plus18: joi.boolean().default(false),
    type: joi.string().required(),
    sendPromotions: joi.boolean()
};

currentDate = function () {
    return new Date();
};

currentDate.description = 'todays date';

var listGuestsV = {
    startdate: joi.date().default(currentDate),
    enddate: joi.date().min(joi.ref('startdate')).default(currentDate),
    location: joi.string().optional(),
    limit: joi.number().optional()
};

var updateGuestV = {
    name: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/),
    phone: joi.string().regex(/^[\+]?(?:[0-9] ?){6,14}[0-9]$/),
    email: joi.string().email(),
    residentName: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/),
    location: joi.string().valid(['Spitalfields', 'Kings Cross', 'King\'s Cross', 'Notting Hill']).insensitive(),
    type: joi.string(),
    roomNo: joi.string(),
    companyName: joi.string(),
    eventName: joi.string(),
    plus18: joi.boolean(),
    checkIn: joi.boolean(),
    checkOut: joi.boolean(),
    sendPromotions: joi.boolean()
};

exports.isFrontDesk = function (req, res, next) {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'frontdesk')) return next();
    res.status(403).end();
};

exports.createGuest = function (req, res, next) {

    var result = joi.validate(req.body, guestV, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    Guest.create(result.value, function (err, user) {
        if (err) return next(err);
        if (!user) /*TODO: What to do*/ ;
        res.json(user.public());
    });
};

/**
 * Query by date
 * @param req
 * @param res
 * @param next
 */
exports.listGuests = function (req, res, next) {


    var result = joi.validate(req.query, listGuestsV, {});
    if (result.error) return res.status(400).json(result.error);
    var startDate = moment(result.value.startdate).startOf('day').toDate();
    var endDate = moment(result.value.enddate).startOf('day').add(1, 'day').toDate();
    var searchQuery = {createdAt: {$gte: startDate, $lt: endDate}, deleted: false};
    if (result.value.location) {
        searchQuery.location = new RegExp(result.value.location,'i');
            ///^result.value.location$/i };
    }
    Guest.find(searchQuery)
        .limit(req.query.limit ? req.query.limit : 100)
        .skip(req.query.offset ? req.query.offset : 0)
        .sort([['createdAt', 'descending']]).exec(function (err, users) {
            if (err) return next(err);
            var arr = [];
            users.forEach(function (user) {
                arr.push(user.public());
            });
            res.json(arr);
        });
};

exports.updateGuest = function (req, res, next) {

    var result = joi.validate(req.body, updateGuestV, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    Guest.findOne({_id: req.params.guestId}, function (err, guest) {
        if (err) return next(err);
        if (!guest) return res.status(404).json({message: 'Guest not found, invalid identifier'});

        if (result.value.checkIn === true) {

            if (guest.checkedOut !== false) {
                //TODO: throw error
            }

            if (!guest.checkedInAt) {
                guest.checkedInBy = req.user._id;
                guest.checkedInAt = new Date();
                guest.checkedIn = true;
            }

        }

        if (result.value.checkOut === true) {

            if (guest.checkedIn !== true) {
                //TODO: throw error
            }

            if (!guest.checkedOutAt) {
                guest.checkedOutBy = req.user._id;
                guest.checkedOutAt = new Date();
                guest.checkedOut = true;
            }
        }

        var update = false;
        for (prop in result.value) {
            guest[prop] = result.value[prop];
            if (joi.validate(prop, joi.string().valid(['name', 'email', 'residentName', 'phone', 'residentName']).required().error == null))
                update = true;
        }

        if (update) guest.updatedBy = req.user._id;

        guest.save(function (err, newGuest) {
            if (err) return next(err);
                res.json(newGuest);
        });


    });
};

exports.deleteGuest = function (req, res, next) {

    Guest.findOne({_id: req.params.guestId}, function (err, guest) {
        if (err) return next(err);
        if (!guest) return res.status(404).json({message: 'Guest not found, invalid identifier'});

        guest.deletedBy = req.user._id;
        guest.deletedAt = new Date();
        guest.deleted = true;

        guest.save(function (err, newGuest) {
            if (err) return next(err);
            res.json({msg: 'Succesful', id: newGuest.id});
        });


    });
};
