const Quote = require('../models/quote');

exports.create = (req, res) => {
  const quote = new Quote({
    quote: req.body.quote,
    author: req.body.author,
    category: req.body.category,
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

exports.random = (req, res) => {
  Quote.estimatedDocumentCount().exec((err, count) => {
    const rand = Math.floor(Math.random() * count);
    Quote.findOne()
      .select({ quote: 1, author: 1, category: 1 })
      .skip(rand)
      .exec((err, quotes) => res.send(quotes));
  });
};

exports.find = (req, res) => {
  Quote.findOne({ _id: req.params.quoteId }, (err, quote) => {
    if (!quote) {
      res.status(404).json({ error: 'The quote could not be found.' });
    } else {
      res.status(200).json(quote);
    }
  });
};

exports.patch = (req, res) => {
  Quote.findOne({ _id: req.params.quoteId }, (err, quote) => {
    if (!quote) {
      res.status(404).json({ error: 'The author could not be found.' });
    } else {
      if (req.body.quote) {
        quote.set({ name: req.body.quote });
      }
      if (req.body.author) {
        quote.set({ author: req.body.author });
      }
      quote.save().then(() => {
        res.status(200).json(quote);
      });
    }
  });
};

exports.delete = (req, res) => {
  Quote.findByIdAndRemove({ _id: req.params.quoteId }, (err, quote) => {
    if (!quote) {
      res.status(404).json({ error: 'The quote could not be found.' });
    } else {
      res.status(204).json(quote);
    }
  });
};
