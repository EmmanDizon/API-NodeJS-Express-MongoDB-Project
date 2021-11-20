const config = require('config');
const mongoose = require('mongoose');
const helmet = require('helmet');
const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/routes')(app);
require('./dbconfig/dbconfig')(mongoose);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

config.get('jwtPrivateKey');

if(!config.get('jwtPrivateKey')){
    console.error('jwtPrivateKey is undefined');
    process.exit(1);
}

app.listen(process.env.PORT || 3000, () =>{
    console.log(`Listening on port ${process.env.PORT || 3000}...`);
});