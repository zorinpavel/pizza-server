const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();


router.options('/*', (req, res) => {
    return res.status(200);
});

router.get('/', async(req, res) => {
    return res.status(200).send({ user: req.user });
});


router.get('/:us_id', auth, async(req, res) => {
    const us_id = req.params.us_id;

    try {
        const user = await User
            .findOne({ us_id })
            .populate({
                path: 'contacts',
                populate: {
                    path: 'user',
                }
            });

        if(!user)
            return res.status(404).send({ error: 'Cant find user' });

        return res.send({
            ...user.toJSON(),
            contacts: user.contacts
        });
    } catch(e) {
        return res.status(400).send({ error: 'Cant get user', message: e.message });
    }
});


router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const authToken = await user.generateAuthToken();

        return res.send({ user, authToken });
    } catch(e) {
        return res.status(400).send({ error: 'Request is not valid: provide valid user', message: e.message });
    }
});


router.post('/logout', auth, async(req, res) => {
    try {
        req.user.authToken = '';
        await req.user.save();

        return res.status(200).send({});
    } catch(e) {
        return res.status(500).send({ error: 'Bad request', message: e.message });
    }
});


module.exports = router;
