const Quote = require('../models/quote');

exports.create = (req, res) => {
  const quote = new Quote({
    quote: req.body.quote,
    mood: req.body.mood,
    thinker: req.params.thinkerId,
  });
  if (!quote.thinker) {
    res.status(404).json({ error: 'This thinker could not be found.' });
  } else {
    quote
      .save()
      .then(() => {
        res.status(201).json(quote);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

exports.list = (req, res) => {
  Quote.find()
    .then(quotes => {
      res.status(200).json(quotes);
    })
    .catch(err => {
      console.log(err);
    });
};
