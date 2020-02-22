const Quote = require('../models/quote');

exports.create = (req, res) => {
  const quote = new Quote({
    name: req.body.name,
    quote: req.body.quote,
  });
  quote
    .save()
    .then(() => {
      res.status(201).json(quote);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.list = (req, res) => {
  Quote.find().then(quotes => {
    res.status(200).json(quotes);
  });
};
