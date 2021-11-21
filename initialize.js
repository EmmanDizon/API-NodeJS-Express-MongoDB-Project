const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

require('./startup/logging')();
require('./startup/routes')(app);
require('./dbconfig/dbconfig')(mongoose);
require('./startup/prod')(app);

config.get('jwtPrivateKey');

if(!config.get('jwtPrivateKey')){
    console.error('jwtPrivateKey is undefined');
    process.exit(1);
}

const server = app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  
module.exports = server;