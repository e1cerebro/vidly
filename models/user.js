const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'subscriber',
    }
});

userSchema.methods.generateAuthToken = function() {
    userSignature = {
        _id: this._id,
        name: this.name,
        role: this.role
    }
    const token = jwt.sign(userSignature, 'jwtprivatekey');
    return token;
}

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.userSchema = userSchema;