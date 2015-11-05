var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var GuestSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, lowercase: true},
    selfCheckIn: {type: Boolean, required: false, default: false},
    sendPromotions: {type: Boolean, required: false, default: false},
    plus18: {type: Boolean, required: false, default: false},
    phone: {type: String, required: true},
    location: {type: String, required: true},
    residentName: {type: String, required: false},
    roomNo: {type: String, required: false},
    eventName: {type: String, required: false},
    companyName: {type: String, required: false},
    type: {type: String, required: true},
    deleted: {type: Boolean, required: false, default: false},
    deletedAt: {type: Date, required: false},
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    checkedIn: {type: Boolean, required: false, default: false},
    checkedInAt: {type: Date, required: false},
    checkedInBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    checkedOut: {type: Boolean, required: false, default: false},
    checkedOutAt: {type: Date, required: false},
    checkedOutBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }
});

GuestSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    delete obj.checkedInBy;
    delete obj.checkedOutBy;
    delete obj.updatedBy;
    //delete obj.id;
    return obj;
};

GuestSchema.plugin(timestamps);
var Guest = mongoose.model('Guest', GuestSchema);

Guest.schema.path('email').validate(function (value) {
    return !joi.validate(value, joi.string().email()).error;
}, 'Invalid email');

Guest.schema.path('phone').validate(function (value) {
    return !joi.validate(value, joi.string().regex(/^[\+]?(?:[0-9] ?){6,14}[0-9]$/)).error;
}, 'Invalid phone number');

Guest.schema.path('location').validate(function (value) {
    return !joi.validate(value, joi.string().valid(['Spitalfields', 'Kings Cross', 'King\'s Cross', 'Notting Hill']).insensitive()).error;
}, 'Invalid location');

var validateName = function (value) {
    return !joi.validate(value, joi.string().regex(/[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+/)).error;
};

Guest.schema.path('name').validate(validateName, 'Invalid Name, must contain full name');
Guest.schema.path('residentName').validate(validateName, 'Invalid Name, must contain full name');

module.exports = Guest;