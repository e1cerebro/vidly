const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { validateLogin } = require('../modules/validation/input');


router.post('/', async(req, res) => {
    //validate name
    const { error } = validateLogin(req.body);
    //Fails - Send 404 message
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password.");

    //Compare password...
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send(`Invalid email or password. ${user.password}`);

    const token = user.generateAuthToken();

    res.send(token);

});

module.exports = router;