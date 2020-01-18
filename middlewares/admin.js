const jwt = require('jsonwebtoken');

function admin(req, res, next) {
    if (req.user.role !== 'admin') return res.status(403).send('Forbidden request')
    next();
}

module.exports = admin;