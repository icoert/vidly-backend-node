const { Rental, validate } = require("../models/rental")
const { Customer } = require('../models/customer')
const { Movie } = require('../models/movie')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();    
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut') // descending order

    res.send(rentals);
})

router.post('/', auth, async (req, res) => {
    
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.message)
    
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer.");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie.");

    if(movie.numberInStock === 0) return res.status(400).send("Movie is not in stock.")

    let rental = new Rental({ 
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
     });

    rental = await rental.save(); // we need a transaction to ensure that both operations will update the state of data in the db or none of them will be applied
                                // so they are atomic, both complete or both rollback
                                // Two phase commit. we need a package that simulates a transaction

    movie.numberInStock--;
    movie.save();

    // new Fawn.Task() // a unit of multiple operations
    //     .save('rentals', rental) // name of the collection (key sensitive)
    //     .update('movies', { _id: movie._id }, {
    //         $inc: { numberInStock: -1 }
    //     })
    //     .run();
    res.send(rental)
});

module.exports = router;