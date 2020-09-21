/*
    Авторизуем пользователя для закрытых endpoints
 */
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const authToken = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if(!user)
            res.status(401).send({ error: 'Cant find user', message: e.message });

        req.authToken = authToken;
        req.user = user;

        next();
    } catch(e) {
        res.status(401).send({ error: 'Please authenticate', message: e.message });
    }
};

module.exports = auth;
