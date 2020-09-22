const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();


router.options('/*', (req, res) => {
    return res.status(200);
});

router.get('/', auth, async(req, res) => {
    return res.status(200).send({ user: req.user });
});


router.get('/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const user = await User
            .findOne({ _id });

        if(!user)
            return res.status(404).send({ error: 'Cant find user' });

        return res.send({
            ...user.toJSON()
        });
    } catch(e) {
        return res.status(400).send({ error: 'Cant get user', message: e.message });
    }
});


router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const authToken = await user.generateAuthToken();

        return res.status(200).send({ user, authToken });
    } catch(e) {
        return res.status(400).send({ error: 'Request is not valid: provide valid user', message: e.message });
    }
});


router.post('/logout', auth, async(req, res) => {
    try {
        req.user.authToken = '';
        await req.user.save();

        return res.status(200);
    } catch(e) {
        return res.status(500).send({ error: 'Bad request', message: e.message });
    }
});


router.post('/signup', async(req, res) => {
    try {
        const userRequested = { name, email, address } = req.body;

        const user = await User.findOne({ email: req.body.email })
            .then((model = {}) => {
                return model ? Object.assign(model, userRequested) : new User(userRequested);
            })
            .then(model => model.save())
            .catch(e => {
                throw new Error(e);
            });

        const authToken = await user.generateAuthToken();

        return res.status(200).send({ user, authToken });
    } catch(e) {
        return res.status(500).send({ error: 'Bad request', message: e.message });
    }
});


module.exports = router;
