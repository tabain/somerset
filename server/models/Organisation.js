var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var OrganisationSchema = new mongoose.Schema({

    name:{type: String,required: true},
    wing: {type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Wing'
    },

    location:  {type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'WingLocation'
    },
    room:  {type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'WingLocationRoom'
    },
    email: {type: String, required: true, lowercase: true},
    phone: {type: String, required: true},
    mobile: {type: String, required: false},
    fax: {type: String, required: false},
    ext: {type: String, required: false},
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

OrganisationSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    //delete obj.id;
    return obj;
};
OrganisationSchema.plugin(timestamps);
var Organisation = mongoose.model('Organisation', OrganisationSchema);
module.exports = Organisation;