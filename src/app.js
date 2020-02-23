const express = require('express');

const thinkerControllers = require('./controllers/thinkers');

const app = express();

app.use(express.json());

app.post('/thinkers', thinkerControllers.create);

app.get('/thinkers', thinkerControllers.list);

app.get('/thinkers/:thinkerId', thinkerControllers.find);

app.patch('/thinkers/:thinkerId', thinkerControllers.patch);

app.delete('/thinkers/:thinkerId', thinkerControllers.delete);

module.exports = app;
