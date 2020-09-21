const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    address: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        validate(value) {
            if(!validator.isLength(value, { min: 6 }))
                throw new Error('Password should be more then 6');
            if(validator.contains(value, 'password'))
                throw new Error('Password can not be that');
        }
    },
    authToken: {
        type: String,
    }
}, {
    timestamps: true
});


userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8);

    next();
});


userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email });

    if(!user)
        throw new Error('Unable to login');

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
        throw new Error('Wrong password');

    return user;
};


userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.authToken = token;
    await user.save();

    return token;
};


userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.authToken;

    return userObject;
};


const User = mongoose.model('User', userSchema);

module.exports = User;
