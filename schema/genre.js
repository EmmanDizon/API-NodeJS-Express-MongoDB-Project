const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
     
    }
});

const Genres = mongoose.model('Genres', genreSchema);

function validateGenre(genre){
    let schema = Joi.object({
        name: Joi.string().min(5).required()
    });

    return schema.validate(genre);
}

module.exports = {
    genreSchema : genreSchema, Genres: Genres,
    validate: validateGenre
}