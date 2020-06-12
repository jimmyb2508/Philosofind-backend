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

app.patch('/quotes/:quoteId', quoteControllers.patch);

app.delete('/quotes/:quoteId', quoteControllers.delete);

app.get('/quotes', quoteControllers.list);

app.get('/quotes/random', quoteControllers.random);

// app.get('/quotes/:quoteId', quoteControllers.find);

app.get('/quotes/ancient', quoteControllers.ancient);

app.get('/quotes/enlightenment', quoteControllers.enlightenment);

app.get('/quotes/modern', quoteControllers.modern);

app.get('/quotes/artists', quoteControllers.artists);

app.get('/quotes/entrepreneurs', quoteControllers.entrepreneurs);

app.get('/quotes/scientists', quoteControllers.scientists);

app.get('/quotes/ancient/random', quoteControllers.randomancient);

app.get('/quotes/enlightenment/random', quoteControllers.randomenlightenment);

app.get('/quotes/modern/random', quoteControllers.randommodern);

app.get('/quotes/artists/random', quoteControllers.randomartists);

app.get('/quotes/entrepreneurs/random', quoteControllers.randomentrepreneurs);

app.get('/quotes/scientists/random', quoteControllers.randomscientists);

app.get('/quotes/:author', quoteControllers.author);

module.exports = app;
