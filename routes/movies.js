const express = require('express');
const router = express.Router();
const inputValidate = require('../modules/validation/input');
const { Movie } = require('../models/movie');

router.get('/', async(req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies)
});

router.get('/:id', (req, res) => {

    Movie.findById(req.params.id)
        .then(result => res.send(result))
        .catch(err => res.status(404).send(err));
});


router.post('/', (req, res) => {

    //Validate Inputs later

    //create a movie object
    let movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: req.body.genre
    });

    //save a movie record in the db
    movie.save()
        .then(result => res.send(result))
        .catch(err => res.status(404).send(err));
});


module.exports = router;