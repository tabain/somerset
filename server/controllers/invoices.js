var Mongoose = require('mongoose');
var User = require('../models/User');
var Invoice = require('../models/Invoice');
var Contract = require('../models/Contract');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');


var Create = {
    propOwner: joi.objectId(),
    organisation: joi.objectId(),
    room: joi.objectId(),
    start: joi.string().optional(),
    end:joi.string().optional(),
    contract:  joi.string().optional(),
    notes: joi.string().optional(),
    monthlyRent: joi.number().optional(),
},
    get = {
        contract: joi.objectId(),
        start: joi.string().optional(),
        end :joi.string().optional(),
        monthlyRent:joi.number().optional(),
        organisation:joi.objectId(),
        room:joi.objectId(),
        propOwner:joi.objectId()
    };

exports.generateInvoice = function(req, res, next){
    var result, start, end, current, sub;
    result = joi.validate(req.body, get, {stripUnknown: true});

    if (result.error) return res.status(400).json(result.error);
    start = new Date(result.start).getMonth();
    end = new Date(result.end).getMonth();
    current = new Date().getMonth();
    sub = current - start;



}

exports.listContracts = function (req, res, next) {
    Contract.find({deleted: false})
        .limit(req.query.limit ? req.query.limit : 30)
        .skip(req.query.offset ? req.query.offset : 0)
        .populate(['propOwner', 'organisation', 'room'])
        .exec(function (err, contracts) {
            if (err) return next(err);
            var arr = [];
            contracts.forEach(function (contract) {
                arr.push(contract.public());
            });
            res.json(arr);
        });
};
exports.createContract = function (req, res, next) {

    var result = joi.validate(req.body, Create, {stripUnknown: true});

    if (result.error) return res.status(400).json(result.error);

    Contract.create(result.value, function (err, contract) {
        if (err) return next(err);
        if (!contract) /*TODO: What to do*/ ;
        res.json(contract.public());
    });


};

exports.updateContract = function (req, res, next) {

    var result = joi.validate(req.body, Create, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    Contract.findOne({_id: req.params.contractId}, function (err, contract) {
            if (err) return next(err);
            if (!contract) return res.status(404).json({message: 'Contract not found, invalid identifier'});
            var update = false;
            for (prop in result.value) {
                contract[prop] = result.value[prop];
                update = true;
        }
        if (update) contract.updatedBy = req.user._id;

        contract.save(function (err, data) {
            if (err) return next(err);
            res.json(data.public());
        });

    });

};

exports.deleteContract = function (req, res, next) {

    Contract.findOne({_id: req.params.contractId}, function (err, contract) {
        if (err) return next(err);
        if (!contract) return res.status(404).json({message: 'Contract not found, invalid identifier'});
        contract.deleted = true;
        contract.deletedAt = new Date();
        contract.deletedBy = req.user._id;

        contract.save(function (err, deleted) {
            if (err) return next(err);
            res.json(deleted.public());
        });

    });


};