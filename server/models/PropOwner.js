var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var PropOwnerSchema = new mongoose.Schema({

    propOwner:{type: String,required: true},
    phone:{type:String, required: false},
    ext:{type:String, required: false},
    mobile:{type:String, required: false},
    email:{type:String, required: false},
    wing: {type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Wing'
    },
    location:  {type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'WingLocation'
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

PropOwnerSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    //delete obj.id;
    return obj;
};
PropOwnerSchema.plugin(timestamps);
var PropOwner = mongoose.model('PropOwner', PropOwnerSchema);
module.exports = PropOwner;