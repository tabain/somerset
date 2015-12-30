var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var VisitorSchema = new mongoose.Schema({

    name:{type: String,required: true},
    email: {type: String, required: true, lowercase: true, unique: true},
    phone: {type: String, required: true},
    mobile: {type: String, required: false},
    age: {type: Number, required: false},
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

VisitorSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    //delete obj.id;
    return obj;
};
VisitorSchema.plugin(timestamps);
var Visitor = mongoose.model('Visitor', VisitorSchema);
module.exports = Visitor;