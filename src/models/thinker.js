const mongoose = require('mongoose');

const thinkerSchema = new mongoose.Schema({
  name: String,
  discipline: String,
});

const Thinker = mongoose.model('Thinker', thinkerSchema);

module.exports = Thinker;
