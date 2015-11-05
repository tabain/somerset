'use strict';
var expect = require('chai').expect;
var Guest = require('../../models/Guest');

describe('Guest Model', function () {

    before(function (done) {
        done();
    });

    it('should not accept invalid phone numbers', function (done) {

        var g = new Guest();

        g.name = 'Emi Mitchell';
        g.phone = '+144443334444';
        g.residentName = 'Farid Haque';
        g.location = 'notting hill';
        g.email = 'emi@erlystage.com';
        g.type = 'student';


        done();
    });
    //it( 'should create a new client with a secret', function (done) {
    //    var client = new Client();
    //    client.id = 'id';
    //    client.name = 'name';
    //    client.secret = 'this is my secret';
    //    client.userId = '54bd1cc8216622c437fb32e0';
    //
    //    client.save( function (err, model) {
    //        if (err) return done( err );
    //        expect( model.password ).to.not.equal( 'test' );
    //        model.verifyPassword( 'this is my secret', function (err, isMatched) {
    //            expect( err ).to.be.null();
    //            expect( isMatched ).to.be.true();
    //            return done();
    //        } );
    //    } );
    //} );
    //
    //it( 'should retrive a new client by its id', function (done) {
    //    Client.findOne( {id: 'id'}, function (err, client) {
    //        if (err) return done( err );
    //        expect( client.userId.toString() ).to.be.equal( '54bd1cc8216622c437fb32e0' );
    //        done();
    //    } );
    //} );

    after(function (done) {
        done();
    })

});
