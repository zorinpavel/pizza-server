const express = require('express');
const User = require('../models/user');
const Order = require('../models/order');
const auth = require('../middleware/auth');

const router = new express.Router();


router.options('/*', (req, res) => {
    return res.status(200);
});

router.get('/', auth, async(req, res) => {
    const orders = await Order.find({ owner: req.user._id });

    return res.status(200).send(orders);
});


router.post('/', async(req, res) => {
    const userRequested = { name, email, address } = req.body;

    const user = await User.findOne({ email: req.body.email })
        .then((model = {}) => {
            return model ? Object.assign(model, userRequested) : new User(userRequested);
        })
        .then(model => model.save())
        .catch(e => {
            throw new Error(e);
        });

    const order = new Order({ owner: user._id, cart: req.body.cart });

    await order.save();

    return res.status(200).send({ user, order });
});


module.exports = router;
