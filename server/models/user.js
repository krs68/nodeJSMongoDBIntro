const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String, required: true, minlength: 5, trim: true, unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: { type: String, required: true, minlenght: 6 },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]

});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return lodash.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    try {
        var user = this;
        var access = 'auth';
        var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
        user.tokens = user.tokens.concat([{ access, token }]);
        return user.save().then(() => {
            return token;
        });
    } catch (e) {
        return console.log('ERROR: In UserSchema.methods.generateAuthToken: In Catch, error:4:', e);
    };
};

var User = mongoose.model('User', UserSchema);

module.exports = { User };
