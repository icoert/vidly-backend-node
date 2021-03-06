const Joi = require('Joi');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { User, validate } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

 router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    res.send(user);
 })

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.message);

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered.');

    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    await user.save();
    
    const token = user.generateAuthToken();

    res
        .header('x-auth-token', token)
        .header("access-control-expose-headers", "x-auth-token") //this header lets a webserver whitelist the headers that the browser or the client is allowed to access
        .send(_.pick(user, ['name', 'email']));

});

module.exports = router;
