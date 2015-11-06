var Location = require('../models/Location');
var joi = require('joi');

var locationV = {
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
exports.getLocations =  function(req, res){


    Location.find(function(err, locations){
        if (err) return err;
        var locs = [];
        if (locations){
            locations.forEach(function(doc){

                locs.push(doc.public());
            });

        }
        res.json(locs);
    });

}
//
//exports.createLocation = function (req, res, next) {
//
//    // TODO: Check Return type as application/json or text/html and return appropriate page
//    // TODO: Verify guest is already added or not
//    // TODO: validate guest
//    var result = joi.validate(req.body, guestV, {stripUnknown: true});
//    if (result.error) return res.status(400).json(result.error);
//
//    Guest.create(result.value, function (err, guest) {
//        if (err) return next(err);
//        res.json(guest.public());
//    });
//};

