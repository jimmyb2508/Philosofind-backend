const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  quote: String,
  author: String,
  category: String,
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
