const express = require('express');
const movies = require('../router/movies');
const genres = require('../router/genres');
const customers = require('../router/customers');
const rentals = require('../router/rentals');
const users = require('../router/users');
const authentication = require('../router/authentication');
const error = require('../middleware/error');

module.exports = function(app){
    app.use('/api/movies', movies);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/authentication', authentication);
    app.use(error);
}