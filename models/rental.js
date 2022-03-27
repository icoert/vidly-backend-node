const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({ // not reusing the customer schema, because we need only the essential properties
    customer: {
        type: new mongoose.Schema({
            name: { 
                type: String, 
                required: true,
                minlength: 3,
                maxlength: 50    
            },
            phone: {
                type: String, 
                required: true,
                minlength: 5,
                maxlength: 50    
            },
            isGold: {
                type: Boolean,
                default: false
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({ // again, not reusing the schema to use only essential properties
            title: { 
                type: String, 
                required: true,
                trim: true, // remove paddings
                minlength: 5,
                maxlength: 255    
            },
            dailyRentalRate: { // used to calculate the daily rental fee
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0 // make sure is a positive number
    }
});

//Static method
rentalSchema.statics.lookup =  function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}

//Instance method
rentalSchema.methods.return = function() {
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = Joi.object({ // we don't want the client to set the dates or the fees, so only two validations needed
        customerId: Joi.objectId().required(),
        rentalId: Joi.objectId().required()
    })

    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;