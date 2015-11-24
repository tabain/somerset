var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var WingSchema = new mongoose.Schema({

    name:{type: String,required: true},
    areaName:{type:String, required: false},
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

WingSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    //delete obj.id;
    return obj;
};
WingSchema.plugin(timestamps);
var Wing = mongoose.model('Wing', WingSchema);
module.exports = Wing;