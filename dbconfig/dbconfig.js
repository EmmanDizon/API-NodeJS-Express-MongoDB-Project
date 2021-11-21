const winston = require('winston');

config = require('config');
module.exports = function (mongoose) { 
    let db = config.get('db');
    mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => winston.info(`connection to ${db} established`));
}