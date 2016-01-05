var Mongoose = require('mongoose');
var User = require('../models/User');
var Member = require('../models/Member');
var Visitor = require('../models/Visitor');
var Visit = require('../models/Visit');
var joi = require('joi');
var moment = require('moment');
var Mailgun = require('mailgun-js');
var config = require('../../config/config');
joi.objectId = require('joi-objectid');
var mailgun = new Mailgun({apiKey: config.MAILGUN_API_KEY, domain: config.MAILGUN_DOMAIN});

var lists = {
    name: joi.string().optional(),
    wing: joi.objectId(),
    //organisation: joi.objectId().optional(),
    deleted: joi.boolean().default(false)

},
    createVisitor = {
        name: joi.string().regex(/[a-zA-Z.]+ [a-zA-Z.]+/).required(),
        phone: joi.string().regex(/^[\+]?(?:[0-9] ?){6,14}[0-9]$/).required(),
        mobile: joi.string().optional(),
        email: joi.string().email().required(),
        age: joi.number().optional()
    },
    createVisitt = {
        member: joi.objectId(),
        visitor: joi.objectId(),
        room: joi.objectId(),
        wing: joi.objectId(),
        location: joi.objectId(),
        organisation: joi.objectId(),
        accepted : joi.boolean().default(false)
    };


exports.listMembers= function (req, res, next) {
    var squery,r;
    var result = joi.validate(req.query, lists, {stripUnknown: true});
    if (result.error) return res.status(400).json(result.error);
    squery = result.value;
    if (result.value.name){
        squery.name = new RegExp(result.value.name.toLowerCase(), 'i');
    }


    Member.find(squery)
        .limit(req.query.limit ? req.query.limit : 30)
        .skip(req.query.offset ? req.query.offset : 0)
        .populate(['wing', 'location', 'room', 'organisation'])
        .exec(function (err, members) {
            if (err) return next(err);
            var arr = [];
            members.forEach(function (member) {
                arr.push(member.public());
            });
            res.json(arr);
        });
    //
    //loadMembers = function(){

    //};

};

exports.findoneVisit = function(req, res, next){
    Visit.findOne({_id: req.params.visitId})
        .populate(['wing', 'location', 'room', 'organisation', 'member', 'visitor'])
        .exec(function (err, visit){
            if (err) return next(err);
            if (!visit) return res.status(400).json(result.error);
            if (visit) {
                res.json(visit.public());
            }
        });
};
exports.createVisitor = function(req, res, next){
    var result = joi.validate(req.body, createVisitor, {stripUnknown: true});

    if (result.error) return res.status(400).json(result.error);
    Visitor.findOne({email: req.body.email}, function(err, doc){
      if (err || (!err && !doc)) {
          createV();
      }if (doc){
            var obj = {
                member: req.body.member,
                visitor: doc.id,
                room: req.body.room,
                wing: req.body.wing,
                location: req.body.location,
                organisation: req.body.organisation
            };
            createVisit(obj);
        }

    });


    function createV(){
        Visitor.create(result.value, function (err, visitor) {
            if (err) return next(err);
            if (!visitor) /*TODO: What to do*/ ;
            if (visitor){
                var obj = {
                    member: req.body.member,
                    visitor: visitor.id,
                    room: req.body.room,
                    wing: req.body.wing,
                    location: req.body.location,
                    organisation: req.body.organisation
                };
                createVisit(obj);
            }

        });
    }
    function createVisit(obj){
        var result = joi.validate(obj, createVisitt, {stripUnknown: true});

        if (result.error) return res.status(400).json(result.error);

        Visit.create(result.value, function(err, visit){
            if (err) return next(err);
            if (!visit) return res.status(400).json(result.error);
            if (visit) {
                Visit.findOne({_id:visit.id})
                    .populate(['wing', 'location', 'room', 'organisation', 'member', 'visitor'])
                    .exec(function(err, doc){
                        if (err) return next(err);
                        if (!doc) return res.status(400).json(result.error);
                        if (doc){
                            var data = {
                                //Specify email data
                                from: config.MAILGUN_FROM_WHO,
                                //The email to contact
                                to: doc.member.email,
                                //Subject and text data
                                subject: 'Hello '+doc.member.name.toUpperCase()+' meet to '+doc.visitor.name.toUpperCase(),
                                html: 'Name of Visitor: '+doc.visitor.name.toUpperCase()+'<br/> Visitor Email: '+doc.visitor.email+'<br/> Please <a href="http://192.168.1.2:3000/selfaccepted/'+doc.id+' ">Accepted</a>'
                            }

                            //Invokes the method to send emails given the above data with the helper library
                            mailgun.messages().send(data, function (err, body) {
                                //If there is an error, render the error page
                                if (err) {
                                    res.render('error', { error : err});
                                    console.log("got an error: ", err);
                                }
                                //Else we can greet    and leave
                                else {
                                    //Here "submitted.jade" is the view file for this landing page
                                    //We pass the variable "email" from the url parameter in an object rendered by Jade

                                    console.log(body);
                                    res.json(visit.public());
                                }

                            });



                        }

                    });

            }
        });
    };

};
exports.updateVisit = function (req, res, next) {



    Visit.findOne({_id: req.params.visitId}, function (err, visit) {
        if (err) return next(err);
        if (!visit) return res.status(404).json({message: 'Member not found, invalid identifier'});
        if (visit){
            visit.accepted = true;


            visit.save(function (err, uvisit) {
                if (err) return next(err);
                res.send("thank you")
                //res.json(uvisit.public());
            });
        }


    });

};

var api_key = 'key-c86dae640d81900ecd77aff209f15f8a';

//Your domain, from the Mailgun Control Panel
var domain = 'sandbox35788e99d4274bfd8d14bd22d07f5c32.mailgun.org';

//Your sending email address
var from_who = 'postmaster@sandbox35788e99d4274bfd8d14bd22d07f5c32.mailgun.org';