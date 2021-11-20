const mongoose = require('mongoose');
const { genreSchema } = require('./genre');
const Joi = require('joi');

const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    genre:{
        type: genreSchema,
        required: true
    },

    numberInStock:{
        type: Number,
        min: 0,
        required: true
    },

    dailyRentalRate:{
        type: Number,
        min: 0,
        required: true
    }
});

const Movies = mongoose.model('Movies', movieSchema);

module.exports = { Movies: Movies }