const express = require('express');
const appDebugger = require('debug')('app:startup');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('../middleware/logger');
const error = require('../middleware/error')
const movies = require('../routes/movies');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns = require('../routes/returns');
const home = require('../routes/home');

module.exports = function(app) {
    app.use(express.json()); // middleware
    app.use(express.urlencoded({ extended: true })); // middleware
    app.use(express.static('public')); // put every static assets in this folder
    app.use(helmet()); // secure requests

    app.use('/', home);
    app.use('/api/movies', movies);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/returns', returns);

    app.use(error);

    const ENV = app.get('env') // internally detects the current environment, it returns development as default

    if(ENV === 'development'){
        app.use(morgan('tiny')); // log tiny format of request in the console - use it only in some situations; enable mostly in development
        appDebugger('Morgan enabled...')
    }

    //Db work
    // dbDebugger('Connected to the db')

    app.use(logger)

    // app.set('view engine', 'pug'); // other view engines - mustache and EJS
    // app.set('views', './views') // default (optional setting)
}