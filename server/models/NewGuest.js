var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');

var NewGuestSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String,unique: true, required: true},
    plus18: {type: Boolean, required: false, default: false},
    phone: {type: String, unique: true, required: true},
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    deleted: {type: Boolean, required: false, default: false},
    deletedAt: {type: Date, required: false},
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }
});

NewGuestSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    delete obj.updatedBy;
    //delete obj.id;
    return obj;
};

NewGuestSchema.plugin(timestamps);
NewGuestSchema.plugin(uniqueValidator);
var NewGuest = mongoose.model('NewGuest', NewGuestSchema);

NewGuest.schema.path('email').validate(function (value) {
    return !joi.validate(value, joi.string().email()).error;
}, 'Invalid email');

NewGuest.schema.path('phone').validate(function (value) {

    return !joi.validate(value, joi.string().regex(/^[\+]?(?:[0-9] ?){6,14}[0-9]$/)).error;
}, 'Invalid phone number');


var validateName = function (value) {
    return !joi.validate(value, joi.string().regex(/[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+/)).error;
};

NewGuest.schema.path('name').validate(validateName, 'Invalid Name, must contain full name');
module.exports = NewGuest;