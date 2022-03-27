const express = require('express');
const app = express();
const winston = require('winston');

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/validation')();

// throw new Error('something failed. testing');

// const p = Promise.reject(new Error("Testing how promise rejection is handled!"))
// p.then(() => console.log('Done'))

const port = process.env.vidly_backend_PORT || 3000;
const server =app.listen(port, () => winston.info(`Listening to port ${port}...`));

module.exports = server;