const mongoose = require('mongoose');


const pizzaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    }
});


pizzaSchema.pre('save', function(next) {
    this.price = parseFloat(this.price).toFixed(2);

    next();
});


const Pizza = mongoose.model('Pizza', pizzaSchema);

module.exports = Pizza;
