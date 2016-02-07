var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var ContractSchema = new mongoose.Schema({

    propOwner:{type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PropOwner'},
    contract:{type:String, required: false},
    start:{type:Date, required: false},
    end:{type:Date, required: false},
    organisation: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Organisation'},
    monthlyRent: {type: Number, required:true},
    room:  {type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    notes:{type:String, required:false},
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

ContractSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    //delete obj.id;
    return obj;
};
ContractSchema.plugin(timestamps);
var Contract = mongoose.model('Contract', ContractSchema);
module.exports = Contract;