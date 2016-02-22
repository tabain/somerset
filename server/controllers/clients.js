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
        age: joi.number().optional(),
        sendPromotions : joi.boolean().default(false)

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
                var members = [];
                if (visitor.sendPromotions){
                    members.push({address: visitor.email, name: visitor.name});
                    mailgun.lists('visitor@erlystage.mailgun.com').members().add({ members: members, subscribed: true }, function (err, body) {
                        console.log(body);
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(body);
                        }
                    });
                }

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
                            res.json(visit.public());

                            function toTitleCase(str)
                            {
                                return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                            }
                            var vis,memb;

                            vis = toTitleCase(doc.visitor.name);
                            memb = toTitleCase(doc.member.name);


                            var data = {
                                //Specify email data
                                from: config.MAILGUN_FROM_WHO,
                                //The email to contact
                                to: doc.member.email,
                                //Subject and text data
                                subject: 'You have a visitor',
                                //subject: 'Hello '+doc.member.name.toUpperCase()+' meet to '+doc.visitor.name.toUpperCase(),
                                html: 'Hi '+memb+' , <br/>'+vis+' is here to visit you. Do you know him? <br/> <a href="http://'+req.headers.host+'/selfaccepted/'+doc.id+' ">Yes</a>'
                            }

                            //Invokes the method to send emails given the above data with the helper library
                            mailgun.messages().send(data, function (err, body) {
                                //If there is an error, render the error page
                                console.log(body);
                                if (err) {
                                    //res.render('error', { error : err});
                                    console.log("got an error: ", err);
                                }
                                //Else we can greet    and leave
                                else {
                                    //Here "submitted.jade" is the view file for this landing page
                                    //We pass the variable "email" from the url parameter in an object rendered by Jade



                                }

                            });


                        }

                    });

            }
        });
    };

};
exports.sendMessage = function(req, res, next){
    function toTitleCase(str)
    {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
    var vis = toTitleCase(req.body.visitor), mem = toTitleCase(req.body.name);
    var data = {
        from: config.MAILGUN_FROM_WHO,
        to: req.body.email,
        subject: 'You have a visitor',
        html: 'Hi '+mem+',<br/>'+vis+' is here to visit you.<br/>Here is a message from him/her:<br/>'+req.body.message

    }

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page

        if(body) res.json(body);
        if (err) {
            //res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page
            //We pass the variable "email" from the url parameter in an object rendered by Jade



        }

    });

};

exports.updateVisit = function (req, res, next) {



    Visit.findOne({_id: req.params.visitId}, function (err, visit) {
        if (err) return next(err);
        if (!visit) return res.status(404).json({message: 'Member not found, invalid identifier'});
        if (visit){
            visit.accepted = true;


            visit.save(function (err, uvisit) {
                if (err) return next(err);
                res.render('thankyou', function(err, html) {
                    if (err) {
                        // log any error to the console for debug
                        console.log(err);
                    }
                    else {
                        //no error, so send the html to the browser
                        res.send(html)
                    };
                });

                //res.json(uvisit.public());
            });
        }


    });

};
