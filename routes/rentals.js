const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require("fawn");
const { inputValidate, validateRental } = require('../modules/validation/input');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { Rental } = require('../models/rental');



Fawn.init(mongoose);

router.get('/', async(req, res) => {
    let rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
})

router.get('/:id', (req, res) => {
    res.send("");
})
router.post('/', async(req, res) => {

    //validate name
    const { error } = validateRental(req.body);
    //Fails - Send 404 message
    if (error) return res.status(404).send(error.details[0].message)

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send("Customer does not exits")

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send("Movie does not exits")

    if (movie.numberInStock === 0) return res.status(404).send("Movie not availabe.")


    customerObj = {
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone
    }

    movieObj = {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
    }

    let rental = new Rental({
        customer: customerObj,
        movie: movieObj,
    })

    try {
        const task = new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

        res.send(rental);
    } catch (error) {
        return res.status(500).send(error)
    }




})

module.exports = router;