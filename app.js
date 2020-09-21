const express = require('express');
const cors = require('cors');

require('./db/mongoose');

const usersRouter = require('./routers/user');
const menuRouter = require('./routers/menu');
const orderRouter = require('./routers/order');

const app = express();
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/user', usersRouter);
app.use('/menu', menuRouter);
app.use('/order', orderRouter);

module.exports = app;
