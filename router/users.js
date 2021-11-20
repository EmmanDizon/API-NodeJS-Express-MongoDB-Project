const express = require('express');
const router = express.Router();
const { User, validate } = require('../schema/users');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async(req, res)=>{
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({username : req.body.username});
    let email = await User.findOne({email : req.body.email});

    if(user || email) return res.status(400).send(`This ${user ? 'username' : email ? 'email' : ''} is already registered...`);

        user = new User(
            _.pick(req.body, ['name','username', 'email', 'password'])
        );

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'username', 'email']));
});
module.exports = router;