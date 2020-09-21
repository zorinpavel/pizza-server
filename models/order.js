const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cart: {
    },
}, {
    timestamps: true
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
