require('dotenv').config();

const app = require('./app');
const port = process.env.PORT;
const host = process.env.HOST;


app.get('*', (req, res) => {
    res.status(404).send({ error: 404 });
});

app.listen(port, host, () => {
    console.log(`Listening ${host}:${port}`);
});
