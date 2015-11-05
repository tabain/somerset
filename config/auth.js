'use strict';
var config = require('./config');

var LocalStrategy = require('passport-local').Strategy;
var User = require('../server/models/User');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            User.findOne({email: email}, function (err, user) {
                if (err) return done(err);
                if (!user) return done(null, false);
                user.verifyPassword(password, function (err, isMatched) {
                    if (err) return done(err);
                    if (!isMatched) return done(null, false);
                    else return done(null, user);
                });
            });
        }
    ));
};