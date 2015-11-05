var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var LocationSchema = new mongoose.Schema({

    name:{type: String,required: true},
    areaName:{type:String, required: false},
    city:{type:String, required: false},
    country:{type:String, required: false}

});

LocationSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    //delete obj.id;
    return obj;
};
LocationSchema.plugin(timestamps);
var Location = mongoose.model('Location', LocationSchema);
module.exports = Location;

