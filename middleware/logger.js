function log(req, res, next) { // custom middleware function
    console.log('Logging...');
    next(); //pass control to the next middleware function
}

module.exports = log;