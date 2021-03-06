const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Rental, validate} = require('../schema/rentals');
const { Movies } = require('../schema/movies');
const { Customers } = require('../schema/customer');
const auth = require('../middleware/authentication');
const moment = require('moment');
 
Fawn.init(mongoose);

router.get('/', async (req, res) =>{
    const rentals = await Rental.find().sort('-dateOut');
});

async function saveRentals(customer, movie, res){
    let rental = new Rental({
        customer:{
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie:{
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try{
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id }, {
            $inc: {numberInStock: -1}
        })
        .run();

        return rental;
    }
    catch(ex) {
        return status(500).send('failed saving database...');
    }
    
}

router.post('/', async(req, res) =>{
    const { error } = validate(req.body);

    if( error ) return res.status(400).send(error.details[0].message);

    const customer = await Customers.findById(req.body.customerId);
    if( !customer ) return res.status(400).send('Invalid Customer.');

    const movie = await Movies.findById(req.body.movieId);
    if( !movie ) return res.send(400).send('Invalid movie.');

    if (movie.numberInStock === 0) return res.status(400).send('Not enough movie stock');

    const result = await saveRentals(customer, movie, res);
    res.send(result);
});

router.post('/returns', auth , async(req, res) => {
    const { error } = validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);

    const rental = await Rental.findOne({
        'customer._id' : req.body.customerId,
        'movie._id': req.body.movieId
    });

    if(!rental) return res.status(404).send('Rental not found.');

    if (rental.dateReturned) return res.status(400).send('Return already processed');

    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await rental.save();

    await Movies.update({_id: rental.movie._id}, {
        $inc: {numberInStock: 1 }
    });
  
    return res.status(200).send(rental);
});

router.get('/:id', async (req, res) =>{
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');
  
    res.send(rental);
});

module.exports = router;