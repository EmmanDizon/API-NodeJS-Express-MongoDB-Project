const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        unique: true
    },
    password: {
        type: String,
        max: 1500
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function (){
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    let schema = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    return schema.validate(user);
}
module.exports = {
    User: User,
    validate: validateUser
}