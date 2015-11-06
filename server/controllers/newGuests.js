var NewGuest = require('../models/NewGuest');
var Visit = require('../models/Visit');
var joi = require('joi');
joi.objectId = require('joi-objectid');

var guestV = {
    name: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/).required(),
    phone: joi.string().regex(/^[\+]?(?:[0-9] ?){6,14}[0-9]$/).required(),
    email: joi.string().email().required(),
    plus18: joi.boolean()
};
var visitV = {
    guestId: joi.objectId().required(),
    locationId: joi.objectId().required(),
    resdientName: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/).optional(),
    company: joi.string().optional(),
    whoAreYou: joi.string().optional(),
    event: joi.string().optional(),
    purposeOfVisit: joi.string().optional(),
    roomNo: joi.string().optional(),
    type: joi.string().required()
};

exports.createGuest = function (req, res, next) {
    // TODO: Check Return type as application/json or text/html and return appropriate page
    // TODO: Verify guest is already added or not
    // TODO: validate guest
    var obj={};

    var visitCreate = req.body;
    var result = joi.validate(req.body, guestV, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    NewGuest.create(result.value, function (err, guest) {
        if (err) return next(err);
        visitCreate.guestId = guest._id;
        console.log(visitCreate.locationId);

        if(guest){
            var result1 = joi.validate(visitCreate, visitV, {stripUnknown: true});

            Visit.create(result1.value, function(err , visit){
                if (err) return next(err);
                if(visit){
                    obj = {
                        guestId : visit.guestId,
                        locationId : visit.locationId,
                        residentName : visit.residentName,
                        company: visit.company || '',
                        roomNo : visit.roomNo || '',
                        event : visit.event || '',
                        purposeOfVisit : visit.purposeOfVisit || '',
                        whoAreYou : visit.whoAreYou || '',
                        type: visit.type,
                        name: guest.name,
                        phone: guest.phone,
                        email:guest.email,
                        plus18: guest.plus18 || false,
                        sendPromotions: visit.sendPromotions || false
                    };
                    console.log(obj);
                    res.json(obj);
                }
            });

        }
        //res.json(guest.public());
    });
};
exports.createVisit = function(req , res , next){
    var result = joi.validate(req.body, visitV, {stripUnknown: true}),
        obj;
    Visit.create(result.value, function(err, visit) {
        if (err) return next(err);

        else if (!visit) return res.status(404).end();
        else if (visit){
            NewGuest.findOne({_id:visit.guestId},{},function(err, guest){
                if (err) return next(err);
                else if (!guest) return res.status(404).end();
                else if (guest){

                    obj = {
                        guestId : visit.guestId,
                        locationId : visit.locationId,
                        residentName : visit.residentName,
                        company: visit.company || '',
                        roomNo : visit.roomNo || '',
                        event : visit.event || '',
                        purposeOfVisit : visit.purposeOfVisit || '',
                        whoAreYou : visit.whoAreYou || '',
                        type: visit.type,
                        name: guest.name,
                        phone: guest.phone,
                        email:guest.email,
                        plus18: guest.plus18 || false,
                        sendPromotions: visit.sendPromotions || false
                    };
                    console.log(obj);
                    res.json(obj);


                }
            });

        }



    })
};

exports.getGuest = function (req, res) {

    var qu,
        obj={};

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
    NewGuest.findOne(qu, {}, {sort: {'createdAt': -1}}, function (err, guest) {
        if (err) {
            return res.status(404).json({message: 'Guest not found, invalid identifier'});
        } else {
            if (guest) {
                Visit.findOne({guestId: guest._id},{},{sort: {'createdAt': -1}}, function(err, visit){
                    if (err) return next(err);
                    if(visit){
                        obj = {
                            guestId : visit.guestId,
                            locationId : visit.locationId,
                            residentName : visit.residentName|| '',
                            company: visit.company || '',
                            roomNo : visit.roomNo || '',
                            event : visit.event || '',
                            purposeOfVisit : visit.purposeOfVisit || '',
                            whoAreYou : visit.whoAreYou || '',
                            type: visit.type,
                            name: guest.name,
                            phone: guest.phone,
                            email:guest.email,
                            plus18: guest.plus18 || false,
                            sendPromotions: visit.sendPromotions || false
                        };
                        console.log(obj);
                        res.json(obj);
                    }
                });
                //res.status(200).json(guest);
            }
            else if (!guest) return res.status(404).end();
        }

    });
};


