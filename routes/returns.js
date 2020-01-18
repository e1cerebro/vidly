const moment = require('moment');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Rental } = require('../models/rental');



router.post('/', auth, async(req, res) => {
    customerId = req.body.customerId;
    movieId = req.body.movieId;


    if (!customerId) return res.status(400).send('Customer ID required!');
    if (!movieId) return res.status(400).send('Movie ID required!');

    const rental = await Rental.lookup(customerId, movieId);
    if (!rental) return res.status(404).send("Rental does not exist");

    if (rental.dateReturned) return res.status(400).send("Rental return aleady processed.");

    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await rental.save();

    console.log(rental.rentalFee)

    res.status(200).send("Return successfully processed");
});


module.exports = router