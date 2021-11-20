const express = require('express');
const router = express.Router();
const { Genres } =  require('../schema/genre');
const auth = require('../middleware/authentication');
const admin = require('../middleware/admin');

async function createGenre (req) {
    let result;
    
    const genre = new Genres({
        name: req.body.name,
    });
        return await genre.save();
}
    
router.post('/', [auth, admin], (async (req, res) =>{
    let result = await createGenre(req);
    res.send(result);
}));

router.get('/', auth, async (req, res) =>{
    const result = await Genres.find().sort('name');
    res.send(result);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const customer = await Genres.findByIdAndRemove(req.params.id);
  
    if (!customer) return res.status(403).send('The genres with the given ID was not found.');
  
    res.send(customer);
  });

module.exports = router;