const request = require('supertest');
const  { Rental } = require ('../../schema/rentals');
const  { Movies } = require ('../../schema/movies');
const mongoose = require('mongoose');
const { User } = require('../../schema/users');
const moment = require('moment');

let server; 
let customerId; 

let rental;
let token; 
let movie;
let movieId;

describe('/api/returns', () =>{
    beforeEach( async () =>{
        server = require('../../initialize');
        token = new User().generateAuthToken();

        customerId =  mongoose.Types.ObjectId();
        movieId =  mongoose.Types.ObjectId();

        movie = new Movies({
            _id: movieId,
            title: '4444',
            dailyRentalRate: 500,
            genre:{
                name: 'genre1234',
            },
            numberInStock: 10
        });
        await movie.save();

         rental = new Rental({
            customer:{
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie:{
                _id: movieId,
                title: '12345',
                dailyRentalRate: 500
            },
        });

        await rental.save();
       
    });

    afterEach( async () =>{
        server.close();
        await Rental.remove({});
        await Movies.remove({});
     
    });

    it('should work !',async () =>{
       const res = await Rental.findById(rental._id);

       expect(res).not.toBeNull();
    });

    const exec = function() {
        return request(server)
        .post('/api/rentals/returns')
        .set('x-auth-token', token)
        .send({ movieId, customerId });
    }

    beforeEach( () =>{
        token = new User().generateAuthToken();
    });

    it('should return 401 error if the client is not logged in', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
   
        customerId = ''

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for the customer/movie', async () => {
        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });


    it('should return 400 if already processed.', async () => {
        rental.dateReturned = new Date();

        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if valid request.', async () => {

        const res = await exec();

        expect(res.status).toBe(200);
    });


    it('should set the returnedDate if input is valid', async () => {
    
        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);
    
        expect(rentalInDB).toBeDefined();
    });

    it('should set the rental fee if input is valid', async () => {

        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);
        expect(rentalInDB.rentalFee).toBe(3500);
    });


    it('should increase the movie stock', async () => {
        const res = await exec();

        const movieInDB = await Movies.findById(movieId);
        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if input is valid', async () => {
        const res = await exec();

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(
            ['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']
        ));
    });


 
});