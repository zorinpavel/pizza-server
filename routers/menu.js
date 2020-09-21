const express = require('express');
const Pizza = require('../models/pizza');

const router = new express.Router();


router.options('/*', (req, res) => {
    return res.status(200);
});

router.get('/', async(req, res) => {
    const pizzas = await Pizza.find({});

    return res.status(200).send(pizzas);
});


router.get('/:id', async(req, res) => {
    const _id = req.params.id;

    try {
        const pizza = await Pizza.findById(_id);

        if(!pizza)
            return res.status(404).send({ error: 'Cant find pizza' });

        return res.status(200).send(pizza);
    } catch(e) {
        return res.status(400).send({ error: 'Cant get pizza', message: e.message });
    }
});


module.exports = router;
