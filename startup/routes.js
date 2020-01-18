const errorHandler = require("../middlewares/error")
const inputValidate = require('../modules/validation/input');
const _genres = require('../routes/genres');
const _customers = require('../routes/customers');
const _movies = require('../routes/movies');
const _rental = require('../routes/rentals');
const _users = require('../routes/users');
const _auth = require('../routes/auth');
const _returns = require('../routes/returns');
const bodyParser = require('body-parser')

module.exports = function(app) {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use('/api/genres', _genres)
    app.use('/api/customers', _customers)
    app.use('/api/movies', _movies)
    app.use('/api/rentals', _rental)
    app.use('/api/users', _users)
    app.use('/api/auth', _auth)
    app.use('/api/returns', _returns)

    //Error middleware
    app.use(errorHandler)
}