const express = require('express');

// const cors = require('cors');

const app = express();

const quoteControllers = require('./controllers/quote');

// app.use(cors);

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.post('/quotes', quoteControllers.create);

app.get('/quotes', quoteControllers.list);

app.get('/quotes/random', quoteControllers.random);

app.get('/quotes/:quoteId', quoteControllers.find);

app.patch('/quotes/:quoteId', quoteControllers.patch);

app.delete('/quotes/:quoteId', quoteControllers.delete);

module.exports = app;
