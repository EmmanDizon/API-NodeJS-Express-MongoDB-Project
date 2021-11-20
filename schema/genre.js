const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Genres = mongoose.model('Genres', genreSchema);

module.exports = {genreSchema : genreSchema, Genres: Genres}