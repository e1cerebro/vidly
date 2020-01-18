//const asyncMiddleware = require('../middlewares/async')
const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const admin = require('../middlewares/admin');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const inputValidate = require('../modules/validation/input');
const { Genre } = require('../models/genre');

//1. GET Genres
router.get('/', async(req, res) => {

    const genres = await Genre.find().sort('name');
    res.send(genres)

});

router.get('/:id', validateObjectId, async(req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Could not find genre!");
    res.send(genre);

});


//2. Create Genres
router.post('/', auth, async(req, res) => {

    //validate name
    const { error } = inputValidate.validateName(req.body);
    //Fails - Send 404 message
    if (error) return res.status(401).send(error.details[0].message);

    // const nameExists = Genre.find({ name: req.body.name });
    // console.log("Name", nameExists)
    // if (nameExists) return res.status(400).send("Genre already exists");

    const genre = new Genre({
        name: req.body.name
    });

    await genre.save();
    res.status(200).send(genre)

});

//3. Update Genres
router.put('/:id', auth, async(req, res) => {

    //validate name
    const { error } = inputValidate.validateName(req.body);
    //Fails - Send 404 message
    if (error) return res.status(404).send(error.details[0].message)


    const genreID = req.params.id;
    const genreName = req.body.name;

    //find the genre
    let genre = await Genre.findById(genreID)
    genre.name = genreName;
    genre.save();
    res.send(genre);

});

//4. Delete Genres
router.delete('/:id', [auth, admin], async(req, res) => {

    const genreID = req.params.id;

    //find the genre
    const genre = await Genre.findById(genreID);
    genre.delete();
    res.send(genre);



});

module.exports = router;