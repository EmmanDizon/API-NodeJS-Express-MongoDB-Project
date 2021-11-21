const express = require('express');
const router = express.Router();
const { Genres, validate } =  require('../schema/genre');
const auth = require('../middleware/authentication');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObectId');
   
router.post('/', auth, (async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    let genre = new Genres({
        name: req.body.name,
    });
    
    await genre.save();

    res.send(genre);
}));

router.get('/', async (req, res) =>{
    const result = await Genres.find().sort('name');
    res.send(result);
});

router.get('/:id', validateObjectId, async (req, res) => {
   
    const genre = await Genres.findById(req.params.id);
  
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
  });

router.delete('/:id', [auth, admin], async (req, res) => {
    const customer = await Genres.findByIdAndRemove(req.params.id);
  
    if (!customer) return res.status(403).send('The genres with the given ID was not found.');
  
    res.send(customer);
  });

module.exports = router;