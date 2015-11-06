var Guest = require('../models/Guest');
var joi = require('joi');

var guestV = {
    name: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/).required(),
    phone: joi.string().regex(/^[\+]?(?:[0-9] ?){6,14}[0-9]$/).required(),
    email: joi.string().email().required(),
    residentName: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/),
    location: joi.string().valid(['Spitalfields', 'Kings Cross', 'King\'s Cross', 'Notting Hill']).insensitive().required(),
    type: joi.string().required(),
    roomNo: joi.string(),
    companyName: joi.string(),
    eventName: joi.string(),
    sendPromotions: joi.boolean(),
    plus18: joi.boolean()
};

exports.createGuest = function (req, res, next) {
    // TODO: Check Return type as application/json or text/html and return appropriate page
    // TODO: Verify guest is already added or not
    // TODO: validate guest
    var result = joi.validate(req.body, guestV, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    Guest.create(result.value, function (err, guest) {
        if (err) return next(err);
        res.json(guest.public());
    });
};

exports.getGuest = function (req, res) {

    var qu;

    if (!req.query.email && !req.query.phone) {
        return res.status(401);
    }
    else if (!req.query.email && req.query.phone) {
        qu = {phone: req.query.phone};
    }
    else if (req.query.email && !req.query.phone) {
        qu = {email: req.query.email};
    }
    else if (req.query.email && req.query.phone) {
        qu = {email: req.query.email};
    }
    Guest.findOne(qu, {}, {sort: {'createdAt': -1}}, function (err, guest) {
        if (err) {
            return res.status(404).json({message: 'Guest not found, invalid identifier'});
        } else {
            if (guest) return res.status(200).json(guest);
            else if (!guest) return res.status(404).end();
        }

    });
};