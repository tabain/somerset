var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var InvoiceSchema = new mongoose.Schema({

    contract:{type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Contract'},
    issueDate:{type:Date, required: false},
    period:{type:String, required: false},
    dueDate:{type:Date, required: false},
    monthlyRent:{type:Number, required:false},
    vat:{type:Number, required:false},
    total:{type:Number, required:false},
    organisation:{type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Organisation'},
    propOwner:{type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PropOwner'},
    room:{type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'WingLocationRoom'},
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    status:{type:String, enum: ['unpaid','paid','collection', 'other']},
    deleted: {type: Boolean, required: false, default: false},
    deletedAt: {type: Date, required: false},
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }

});

InvoiceSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    //delete obj.id;
    return obj;
};
InvoiceSchema.plugin(timestamps);
var Invoice = mongoose.model('Invoice', InvoiceSchema);
module.exports = Invoice;