var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var WingLocationSchema = new mongoose.Schema({

    location:{type: String,required: true},
    wing: {type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Wing'
    },
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

WingLocationSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    //delete obj.id;
    return obj;
};
WingLocationSchema.plugin(timestamps);
var WingLocation = mongoose.model('WingLocation', WingLocationSchema);
module.exports = WingLocation;