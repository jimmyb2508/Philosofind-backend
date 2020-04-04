const express = require('express');

const quoteControllers = require('./controllers/quote');

const app = express();

app.use(express.json());

app.use(express.cors());

app.post('/quotes', quoteControllers.create);

app.get('/quotes', quoteControllers.list);

app.get('/quotes/random', quoteControllers.random);

app.get('/quotes/:quoteId', quoteControllers.find);

app.patch('/quotes/:quoteId', quoteControllers.patch);

app.delete('/quotes/:quoteId', quoteControllers.delete);

module.exports = app;
