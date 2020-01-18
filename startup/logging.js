const winston = require('winston')
    //require('winston-mongodb');
require('express-async-errors');


module.exports = function() {

    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: './error-log/uncaughtException.log' }));

    //unhandled promises
    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message);
        process.exit(1);
    });

    winston.add(new winston.transports.File({ filename: './error-log/combined.log' }));
    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));
    // winston.add(new winston.transports.MongoDB({
    //     db: 'mongodb://localhost:27017/vidly'
    // }));

}