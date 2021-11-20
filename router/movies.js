const express = require('express');
const router = express.Router();
const { Movies } =  require('../schema/movies');
const { Genres } = require('../schema/genre');

async function createMovie(req, genres){

    const movies = new Movies({
        title: req.body.title,
        genre:{
            _id: genres._id,
            name: genres.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    try {
        return await movies.save();
    }
    catch(ex) {
        for(error in ex.errors){
            return ex.errors[error].message
        }
    }
}

async function getMovies(){
    return await Movies
            .find()
            .sort('title')
}

async function updateMovies(req, genres){
    try {
         return await Movies.findByIdAndUpdate(`${req.params.id}`,
         { 
           title: req.body.title,
           genre: {
             _id: genres._id,
             name: genres.name
           },
           numberInStock: req.body.numberInStock,
           dailyRentalRate: req.body.dailyRentalRate
         }, { new: true });
      
    }
    catch(ex){
        for(error in ex.errors){
           return ex.errors[error].message;
        }
    }
   
}

router.post('/', async (req, res) =>{
    const genres = await Genres.findById(req.body.genreId);

    if (!genres) return res.status(404).send('The genre with the given ID was not found.');

    let result = await createMovie(req, genres);

    res.send(result);
});

router.get('/', async (req, res) =>{
    const result = await getMovies();
    res.send(result);
});

router.put('/:id', async (req, res) =>{

  const genres = await Genres.findById(req.body.genreId);
  
  if (!genres) return res.status(400).send('Invalid genre.');

  const result = await updateMovies(req, genres);
  
  if (!result) return res.status(404).send('The movie with the given ID was not found.');
  
  res.send(result);
});


module.exports = router;