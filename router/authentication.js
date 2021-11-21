const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { User } = require('../schema/users');
const bcrypt = require('bcrypt');

function validate(auth) {
    let schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });

   return schema.validate(auth);
}

router.post('/', async (req, res) => {

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({username: req.body.username});
    if(!user) return res.status(404).send("Invalid username or password.");

    const authenticate = await bcrypt.compare(req.body.password, user.password);
    if(!authenticate) return res.status(404).send("Invalid username or password.");

    const token = user.generateAuthToken();

    res.send(token);

});

module.exports = router;
