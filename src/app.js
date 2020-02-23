const express = require('express');

const thinkerControllers = require('./controllers/thinkers');

const quoteControllers = require('./controllers/quotes');

const app = express();

app.use(express.json());

app.post('/thinkers', thinkerControllers.create);

app.get('/thinkers', thinkerControllers.list);

app.get('/thinkers/:thinkerId', thinkerControllers.find);

app.patch('/thinkers/:thinkerId', thinkerControllers.patch);

app.delete('/thinkers/:thinkerId', thinkerControllers.delete);

app.post('/thinkers/:thinkerId/quotes', quoteControllers.create);

app.get('/quotes', quoteControllers.list);

module.exports = app;
