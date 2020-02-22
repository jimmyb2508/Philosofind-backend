const express = require('express');

const quoteControllers = require('./controllers/quotes');

const app = express();

app.use(express.json());

app.post('/quote', quoteControllers.create);

app.get('/quote', quoteControllers.list);

module.exports = app;
