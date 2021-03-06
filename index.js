const winston = require('winston');
const express = require('express');
const config = require("config");
const app = express();

require('./startup/logging')();
require("./startup/cors")(app);
require('./startup/routes')(app);
require('./startup/db')();
require("./startup/config")();
require('./startup/validation')();

// throw new Error('something failed. testing');

// const p = Promise.reject(new Error("Testing how promise rejection is handled!"))
// p.then(() => console.log('Done'))

const port = process.env.vidly_backend_PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening to port ${port}...`));

module.exports = server;