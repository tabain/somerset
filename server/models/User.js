// Load required packages
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var joi = require('joi');
var bcrypt = require('bcrypt-nodejs');

// Define our user schema
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'frontdesk'
    },
    defaultLocation: {
        type: String
    },
    permissions: [String],
    deleted: {type: Boolean, required: false, default: false},
    deletedAt: {type: Date, required: false},
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }
});

// Execute before each user.save() call
UserSchema.pre('save', function (callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

UserSchema.methods.verifyPassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.public = function () {
    var obj = this.toObject({virtuals: true});
    delete obj._id;
    delete obj.__v;
    delete obj.password;
    return obj;
};

UserSchema.plugin(timestamps);
var User = mongoose.model('User', UserSchema);

User.schema.path('email').validate(function (value) {
    return !joi.validate(value, joi.string().email()).error;
}, 'Invalid email');

module.exports = User;