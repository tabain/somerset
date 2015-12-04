var mongoose = require('mongoose');
var joi = require('joi');
var timestamps = require('mongoose-timestamp');

var WingLocationRoomSchema = new mongoose.Schema({

    Room:{type: String,required: true},
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

WingLocationRoomSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    //delete obj.id;
    return obj;
};
WingLocationRoomSchema.plugin(timestamps);
var WingLocationRoom = mongoose.model('WingLocationRoom', WingLocationRoomSchema);
module.exports = WingLocationRoom;