var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var VisitSchema = new mongoose.Schema({

    member: {type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },
    visitor: {type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Visitor'
    },
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
    accepted: {type: Boolean, required: false, default: false},
    deletedAt: {type: Date, required: false},
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }

});

VisitSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    //delete obj.id;
    return obj;
};
VisitSchema.plugin(timestamps);
var Visit = mongoose.model('Visit', VisitSchema);
module.exports = Visit;