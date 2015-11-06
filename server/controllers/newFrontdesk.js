var Guest = require('../models/Guest');
var NewGuest = require('../models/NewGuest');
var Visit = require('../models/Visit');
var User = require('../models/User');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');
//var guestV = {
//    name: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/).required(),
//    phone: joi.string().regex(/^[\+]?(?:[0-9] ?){6,14}[0-9]$/).required(),
//    email: joi.string().email().required(),
//    residentName: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/),
//    roomNo: joi.string(),
//    companyName: joi.string(),
//    eventName: joi.string(),
//    location: joi.string().valid(['SpitalFields', 'Kings Cross', 'King\'s Cross', 'Notting Hill']).insensitive().required(),
//    plus18: joi.boolean().default(false),
//    type: joi.string().required(),
//    sendPromotions: joi.boolean()
//};

currentDate = function () {
    return new Date();
};

currentDate.description = 'todays date';

var listGuestsV = {
    startdate: joi.date().default(currentDate),
    enddate: joi.date().min(joi.ref('startdate')).default(currentDate),
    locationId: joi.objectId(),
    limit: joi.number().optional()
};

var updateGuestV = {
    residentName: joi.string().regex(/[a-zA-Z]{0,30}[ ]{0,2}[a-zA-Z]{0,30}/).allow('').optional(),
    locationId: joi.objectId() ,
    type: joi.string(),
    roomNo: joi.string().regex(/[0-9]{0,8}/).allow('').optional(),
    company: joi.string().regex(/[a-zA-Z]{0,30}[ ]{0,1}[a-zA-Z]{0,30}/).allow('').optional(),
    event:joi.string().regex(/[a-zA-Z]{0,30}[ ]{0,1}[a-zA-Z]{0,30}/).allow('').optional(),
    purposeOfVisit:joi.string().regex(/[a-zA-Z]{0,30}[ ]{0,1}[a-zA-Z]{0,50}/).allow('').optional(),
    whoAreYou:joi.string().regex(/[a-zA-Z]{0,30}[ ]{0,1}[a-zA-Z]{0,50}/).allow('').optional(),
    plus18: joi.boolean(),
    checkIn: joi.boolean(),
    checkOut: joi.boolean(),
    sendPromotions: joi.boolean(),
    guestId: joi.objectId(),
    name: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/),
    email: joi.string().email(),
    phone: joi.string().regex(/^[\+]?(?:[0-9] ?){6,14}[0-9]$/)


};

exports.isFrontDesk = function (req, res, next) {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'frontdesk')) return next();
    res.status(403).end();
};

//exports.createGuest = function (req, res, next) {
//
//    var result = joi.validate(req.body, guestV, {stripUnknown: true});
//    if (result.error) return res.status(400).json(result.error);
//
//    Guest.create(result.value, function (err, user) {
//        if (err) return next(err);
//        if (!user) /*TODO: What to do*/ ;
//        res.json(user.public());
//    });
//};

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
    if (result.value.locationId) {
        searchQuery.locationId = result.value.locationId;
        ///^result.value.location$/i };
    }

    Visit.find(searchQuery)
        .limit(req.query.limit ? req.query.limit : 100)
        .skip(req.query.offset ? req.query.offset : 0)
        .sort([['createdAt', 'descending']]).exec(function (err, visits) {
            var arr = [];
            if (err) return next(err);
            if (!visits || visits.length == 0) return res.status(404).json({message: 'invalid identifier'});
            visits.forEach(function(visit , i){
                NewGuest.findOne({_id : visit.guestId}, function(err, guest){
                    if (err) return next(err);
                    //visit.info = guest;
                    var obj = {
                        id : visit._id,
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
                        sendPromotions: visit.sendPromotions || false,
                        selfCheckIn: visit.selfCheckIn,
                        deleted : visit.delete,
                        deletedAt: visit.deletedAt,
                        deletedBy: visit.deletedBy,
                        checkedIn: visit.checkedIn,
                        checkedInAt: visit.checkedInAt,
                        checkedInBy: visit.checkedInBy,
                        checkedOut: visit.checkedOut,
                        checkedOutAt: visit.checkedOutAt,
                        checkedOutBy: visit.checkedOutBy,
                        updatedBy: visit.updatedBy,
                        createdAt: visit.createdAt
                    };

                    arr.push(obj)
                    if (visits.length == arr.length) res.json(arr);
                });

            });

        });
};

exports.updateGuest = function (req, res, next) {

    var result = joi.validate(req.body, updateGuestV, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);


    if (result.value.email == undefined||result.value.name==undefined||result.value.phone== undefined) {
        if (!result.value.plus18 || result.value.plus18 ){
            upGuest();
        }
        else{
            updateVisit();
        }



    }
    else {

        upGuest()
    }




    function upGuest(){
        //NewGuest.findOne({
        //    _id:result.value.guestId
        //}, function(err,guest){
        //    if (err) return next(err);
        //    if (!guest) return res.status(404).json({message: 'Guest not found, invalid identifier'});
        //    if(guest){
        //        for (prop in result.value) {
        //            guest[prop] = result.value[prop];
        //        }
        //        guest.save(function(err, visit){
        //            if(err) return next(err);
        //            if(!visit) return res.status(404).json({message: 'Guest not found, invalid identifier'});
        //            if(visit){
        //                updateVisit();
        //
        //            }
        //        });
        //
        //
        //    }
        //});
        NewGuest.update({_id:result.value.guestId}, { $set: result.value}, function(err,doc){
            if(err) return next(err);
            if(!doc) return res.status(404).json({message: 'Guest not found, invalid identifier'});
            if(doc){
                updateVisit();

            }
        });
    };

    function  updateVisit(){
        var result1 = joi.validate(req.body, updateGuestV, {stripUnknown: true});
        Visit.findOne({_id: req.params.visitId}, function (err, visit) {
            if (err) return next(err);
            if (!visit) return res.status(404).json({message: 'Guest not found, invalid identifier'});

            if (result1.value.checkIn === true) {

                if (visit.checkedOut !== false) {
                    //TODO: throw error
                }

                if (!visit.checkedInAt) {
                    visit.checkedInBy = req.user._id;
                    visit.checkedInAt = new Date();
                    visit.checkedIn = true;
                }

            }

            if (result1.value.checkOut === true) {

                if (visit.checkedIn !== true) {
                    //TODO: throw error
                }

                if (!visit.checkedOutAt) {
                    visit.checkedOutBy = req.user._id;
                    visit.checkedOutAt = new Date();
                    visit.checkedOut = true;
                }
            }

            var update = false;
            for (prop in result1.value) {
                visit[prop] = result1.value[prop];
                //if (joi.validate(prop, joi.string().valid(['name', 'email', 'residentName', 'phone', 'residentName']).required().error == null))
                update = true;
            }

            if (update) visit.updatedBy = req.user._id;

            visit.save(function (err, newVisit) {
                if (err) return next(err);
                res.json(newVisit);
            });


        });
    };


    //Visit.findOne({_id: req.params.visitId}, function (err, visit) {
    //    if (err) return next(err);
    //    if (!visit) return res.status(404).json({message: 'Guest not found, invalid identifier'});
    //
    //    if (result.value.checkIn === true) {
    //
    //        if (visit.checkedOut !== false) {
    //            //TODO: throw error
    //        }
    //
    //        if (!visit.checkedInAt) {
    //            visit.checkedInBy = req.user._id;
    //            visit.checkedInAt = new Date();
    //            visit.checkedIn = true;
    //        }
    //
    //    }
    //
    //    if (result.value.checkOut === true) {
    //
    //        if (visit.checkedIn !== true) {
    //            //TODO: throw error
    //        }
    //
    //        if (!visit.checkedOutAt) {
    //            visit.checkedOutBy = req.user._id;
    //            visit.checkedOutAt = new Date();
    //            visit.checkedOut = true;
    //        }
    //    }
    //
    //    var update = false;
    //    for (prop in result.value) {
    //        visit[prop] = result.value[prop];
    //        //if (joi.validate(prop, joi.string().valid(['name', 'email', 'residentName', 'phone', 'residentName']).required().error == null))
    //            update = true;
    //    }
    //
    //    if (update) visit.updatedBy = req.user._id;
    //
    //    visit.save(function (err, newVisit) {
    //        if (err) return next(err);
    //        res.json(newVisit);
    //    });
    //
    //
    //});
};

exports.deleteGuest = function (req, res, next) {

    Visit.findOne({_id: req.params.visitId}, function (err, visit) {
        if (err) return next(err);
        if (!visit) return res.status(404).json({message: 'Guest not found, invalid identifier'});

        visit.deletedBy = req.user._id;
        visit.deletedAt = new Date();
        visit.deleted = true;

        visit.save(function (err, newVisit) {
            if (err) return next(err);
            res.json({msg: 'Succesful', id: newVisit.id});
        });


    });
};