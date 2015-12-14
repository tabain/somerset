var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var MemberSchema = new mongoose.Schema({

    name:{type: String,required: true},
    email: {type: String, required: true, lowercase: true},
    phone: {type: String, required: true},
    mobile: {type: String, required: false},
    ext: {type: String, required: false},
    age: {type: Number, required: false},
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
    organisation:  {type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Organisation'
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

MemberSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    //delete obj.id;
    return obj;
};
MemberSchema.plugin(timestamps);
var Member = mongoose.model('Member', MemberSchema);
module.exports = Member;