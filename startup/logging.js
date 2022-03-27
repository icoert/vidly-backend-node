const winston = require('winston');
const config = require('config');
// require('w inston-mongodb'); // it will prevent from running integration tests
require('express-async-errors');

module.exports = function () {

    // process.on('uncaughtException', (ex) => {
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // })

    process.on('unhandledRejection', (ex) => {
        // winston.error(ex.message, ex);
        // process.exit(1);
        throw ex;
    })

    winston.configure({
    transports: [
      new winston.transports.Console({
          colorize: true, 
          prettyPrint: true,
          format: winston.format.combine(
            winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
            winston.format.align(),
            winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`))
         }),
      new winston.transports.File({ 
          filename: './logs/logs.log',    
          format: winston.format.combine(
                winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                winston.format.align(),
                winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`))
            }),
    //   new winston.transports.MongoDB({ 
    //     db: config.get('db_url'),
    //     options: {
    //         useUnifiedTopology: true
    //     },
    //     level: 'error',
    //     collection: 'server_logs',
    //     format: winston.format.combine(
    //     winston.format.timestamp(),
    //     // Convert logs to a json format
    //     winston.format.json())
    // })
    ],
    exceptionHandlers: [
        new winston.transports.Console({colorize: true, prettyPrint: true }),
        new winston.transports.File({ 
            filename: './logs/exceptions.log',
            format: winston.format.combine(
                winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                winston.format.align(),
                winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`))}),
        // new winston.transports.MongoDB({ 
        //     db: config.get('db_url'),
        //     options: {
        //         useUnifiedTopology: true
        //     },
        //     level: 'error',
        //     collection: 'server_logs',
        //     format: winston.format.combine(
        //     winston.format.timestamp(),
        //     // Convert logs to a json format
        //     winston.format.json())
        // })
        ]
    })
}