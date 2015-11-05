'use strict';
var expect = require('chai').expect;
var User = require('../../models/User');

describe('User Model', function () {

    before(function (done) {
        done();
    });

    it('should not accept invalid phone numbers', function (done) {

        var g = new User();

        g.email = 'emi@';
        g.password = 'student';

        g.validate(function (err) {
            expect(err).to.exist;
            done();
        });
    });

    after(function (done) {
        done();
    })

});
