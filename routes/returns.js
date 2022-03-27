const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const Joi = require('joi');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const moment = require('moment');
const validate = require('../middleware/validate');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    // if(!req.body.customerId) return res.status(400).send('customerId not provided');
    // if(!req.body.movieId) return res.status(400).send('movieId not provided');
    // Static methods - Rental.lookup
    // Instance methods - new User().generateAuthToken()
    
    // const rental = await Rental.findOne({
    //     'customer._id': req.body.customerId,
    //     'movie._id': req.body.movieId
    // });

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send('Rental not found');

    if(rental.dateReturned) return res.status(400).send('Return already processed');

    //Information Expert Principle
    // rental.dateReturned = new Date();
    // const rentalDays = moment().diff(rental.dateOut, 'days');
    // rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

    rental.return();

    await rental.save();

    await Movie.updateOne({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 } //increment operator
    });

    // return res.status(200).send(rental);
    return res.send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })

    return schema.validate(req);
}

module.exports = router;