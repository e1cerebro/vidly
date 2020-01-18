const express = require('express');

const app = express();
require('./startup/logging')();
//Require the routes
require('./startup/routes')(app);
//startup db connection
require('./startup/db-connect')(app);
require('./startup/prod')(app);

//throw new Error("Something failed during startup.");

const port = process.env.PORT || 8000;
const server = app.listen(port, () => console.log(`Example app listening on port ${port}`))


module.exports = server;