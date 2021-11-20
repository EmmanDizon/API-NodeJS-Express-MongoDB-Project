const winston = require('winston');
require('winston-mongodb');
const mongoose = require('mongoose');
require('express-async-errors');

module.exports = function(){
    winston.exceptions.handle(
        new winston.transports.File({filename: 'uncaughtExceptions.log'}),
        new winston.transports.MongoDB({db: 'mongodb://localhost/vidly'}));
    
    winston.add(new winston.transports.File({filename: 'logfile.log'}));
    winston.add(new winston.transports.MongoDB({db: 'mongodb://localhost/vidly'}));
}