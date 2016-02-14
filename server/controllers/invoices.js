var Mongoose = require('mongoose');
var User = require('../models/User');
var Invoice = require('../models/Invoice');
var Contract = require('../models/Contract');
var joi = require('joi');
var moment = require('moment');
joi.objectId = require('joi-objectid');


var Create = {
        contract: joi.objectId(),
        issueDate: joi.string().optional(),
        period :joi.string().optional(),
        dueDate:joi.string().optional(),
        status:joi.string().optional(),
        vat:joi.number().optional(),
        total:joi.number().optional(),
        //balance:joi.number().optional(),
        monthlyRent:joi.number().optional(),
        organisation:joi.objectId(),
        room:joi.objectId(),
        propOwner:joi.objectId()
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
    //var result, start, end, current, sub;
    //result = joi.validate(req.body, get, {stripUnknown: true});
    //
    //if (result.error) return res.status(400).json(result.error);
    //start = new Date(result.start).getMonth();
    //end = new Date(result.end).getMonth();
    //current = new Date().getMonth();
    //sub = current - start;



}

exports.invoices = function (req, res, next) {
    Invoice.find({deleted: false})
        .limit(req.query.limit ? req.query.limit : 30)
        .skip(req.query.offset ? req.query.offset : 0)
        .populate(['propOwner', 'organisation', 'contract', 'room'])
        .exec(function (err, contracts) {
            if (err) return next(err);
            var arr = [];
            contracts.forEach(function (contract) {
                arr.push(contract.public());
            });
            res.json(arr);
        });
};
exports.create = function (req, res, next) {

    var result = joi.validate(req.body, Create, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);
    Invoice.findOne({period: result.value.period, contract:result.value.contract}, function(err, doc){
        if (err || (!err && !doc)) {
            invoiceCreate();
        }if (doc){
            res.json(doc.public());
        }
    });
    function invoiceCreate(){
        Invoice.create(result.value, function (err, invoice) {
            if (err) return next(err);
            if (!invoice) /*TODO: What to do*/ ;
            res.json(invoice.public());
        });
    };




};

exports.update = function (req, res, next) {

    var result = joi.validate(req.body, Create, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);

    Invoice.findOne({_id: req.params.invoiceId}, function (err, invoice) {
        if (err) return next(err);
        if (!invoice) return res.status(404).json({message: 'Invoice not found, invalid identifier'});
        var update = false;
        for (prop in result.value) {
            invoice[prop] = result.value[prop];
            update = true;
        }
        if (invoice) invoice.updatedBy = req.user._id;

        invoice.save(function (err, data) {
            if (err) return next(err);
            res.json(data.public());
        });

    });

};

exports.delete = function (req, res, next) {

    Invoice.findOne({_id: req.params.invoiceId}, function (err, invoice) {
        if (err) return next(err);
        if (!invoice) return res.status(404).json({message: 'Invoice not found, invalid identifier'});
        invoice.deleted = true;
        invoice.deletedAt = new Date();
        invoice.deletedBy = req.user._id;

        invoice.save(function (err, deleted) {
            if (err) return next(err);
            res.json(deleted.public());
        });

    });


};