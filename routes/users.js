const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express')
const router = express.Router();
const { User } = require('../models/user');
const { validateUser } = require('../modules/validation/input');
const auth = require('../middlewares/auth');


router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select("-password")
    res.send(user);

})

router.post('/', async(req, res) => {
    //validate name
    const { error } = validateUser(req.body);
    //Fails - Send 404 message
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User alrerady registered.");

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    //user = _.pick(user, ['name', 'email']);

    const token = user.generateAuthToken();

    res.header({ 'x-auth-token': token }).send(user);

});

module.exports = router;