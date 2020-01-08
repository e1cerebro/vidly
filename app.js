//Service for managing list of genres EG. Action, Comedy etc
const express = require('express');
const app = express();
const inputValidate = require('./modules/validation/input');

app.use(express.json());

const port = process.env.PORT || 8100;

//list of genres
const genres = [
    { "id": 1, "name": "Comedy" },
    { "id": 2, "name": "Action" },
    { "id": 3, "name": "Thriller" },
    { "id": 4, "name": "Sci-Fi" },

]

//1. GET Genres
app.get('/api/genres', (req, res) => {
    res.send(genres);
});


//2. Create Genres
app.post('/api/genres', (req, res) => {

    //validate name
    const { error } = inputValidate.validateName(req.body);
    //Fails - Send 404 message
    if (error) return res.status(404).send(error.details[0].message)

    const genre = {
        "id": genres.length + 1,
        "name": req.body.name,
    }

    genres.push(genre);

    res.status(200).send(genres)
});

//3. Update Genres
app.put('/api/genre/:id', (req, res) => {

    //validate name
    const { error } = inputValidate.validateName(req.body);
    //Fails - Send 404 message
    if (error) return res.status(404).send(error.details[0].message)

    //find the genre
    const genre = genres.find(g => parseInt(req.params.id) === g.id);

    if (!genre) return res.status(404).send(`Couldn't find gnre with ID ${req.params.id}`);

    genre.name = req.body.name;

    res.send(genre);
});

//4. Delete Genres
app.delete('/api/genre/:id', (req, res) => {
    //find the genre
    const genre = genres.find(g => parseInt(req.params.id) === g.id);
    if (!genre) return res.status(404).send(`Couldn't find gnre with ID ${req.params.id}`);

    const index = genres.indexOf(genre);

    genres.splice(index, 1);

    res.send(genres);


});

app.listen(port, () => console.log(`Example app listening on port ${port}`))