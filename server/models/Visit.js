var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var VisitSchema = new mongoose.Schema({
    guestId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'NewGuest'
    },
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Location'},
    selfCheckIn: {type: Boolean, required: false, default: false},
    sendPromotions: {type: Boolean, required: false, default: false},
    event: {type: String, required: false},
    company: {type: String, required: false},
    whoAreYou: {type: String, required: false},
    purposeOfVisit: {type: String, required: false},
    residentName: {type: String, required: false},
    roomNo: {type: String, required: false},
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

VisitSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    delete obj.checkedInBy;
    delete obj.checkedOutBy;
    delete obj.updatedBy;
    //delete obj.id;
    return obj;
};


VisitSchema.plugin(timestamps);
var Visit = mongoose.model('Visit', VisitSchema);
//var validateResidentName = function (value) {
//    return !joi.validate(value, joi.string().regex(/[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+/)).error;
//};
//VisitSchema.schema.path('residentName').validate(validateResidentName, 'Invalid Resident Name, must contain resident name');
module.exports = Visit;