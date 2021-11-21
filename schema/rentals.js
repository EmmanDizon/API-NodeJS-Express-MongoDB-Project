const Joi = require('joi');

const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    customer: {
        required: true,
        type: new mongoose.Schema({
            name:{
                type: String,
                required: true
            },
            isGold: {
                type: Boolean,
                default: true
            },
            phone: {
                type: Number,
                minlength: 11,
                maxlength: 11
            }
        })
    },
    movie: {
        required: true,
        type: new mongoose.Schema({
            title:{
                type: String,
                required: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0
            }
        })
    },
    dateOut: { 
        type: Date, 
        required: true,
        default: Date.now
      },
      dateReturned: { 
        type: Date
      },
      rentalFee: { 
        type: Number, 
        min: 0
      }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    let schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });

    return schema.validate(rental);
}

module.exports = {
    validate: validateRental,
    Rental: Rental
}