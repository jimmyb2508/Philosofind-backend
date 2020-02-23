const mongoose = require('mongoose');

const { Schema } = mongoose;

const quoteSchema = new mongoose.Schema({
  quote: String,
  mood: Number,
  thinker: { type: Schema.ObjectId, ref: 'Quote' },
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
