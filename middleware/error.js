const winston = require('winston');

module.exports = function (err, req, res, next) {  
    // error, warn, info, verbose, debug, silly
    // winston.error(err.message);
    // winston.log('error', err.message, err); //optionally store metadata=err

    winston.error(err.message, err)

    res.status(500).send('Something failed.')
} 