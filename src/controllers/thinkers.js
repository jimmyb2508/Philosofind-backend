const Thinker = require('../models/thinker');

exports.create = (req, res) => {
  const thinker = new Thinker({
    name: req.body.name,
    discipline: req.body.discipline,
  });
  thinker
    .save()
    .then(() => {
      res.status(201).json(thinker);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.list = (req, res) => {
  Thinker.find().then(thinkers => {
    res.status(200).json(thinkers);
  });
};

exports.find = (req, res) => {
  Thinker.findOne({ _id: req.params.thinkerId }, (err, thinker) => {
    if (!thinker) {
      res.status(404).json({ error: 'The thinker could not be found.' });
    } else {
      res.status(200).json(thinker);
    }
  });
};

exports.patch = (req, res) => {
  Thinker.findOne({ _id: req.params.thinkerId }, (err, thinker) => {
    if (!thinker) {
      res.status(404).json({ error: 'The thinker could not be found.' });
    } else {
      if (req.body.name) {
        thinker.set({ name: req.body.name });
      }
      if (req.body.discipline) {
        thinker.set({ discipline: req.body.discipline });
      }
      thinker.save().then(() => {
        res.status(200).json(thinker);
      });
    }
  });
};

exports.delete = (req, res) => {
  Thinker.findByIdAndRemove({ _id: req.params.thinkerId }, (err, thinker) => {
    if (!thinker) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(204).json(thinker);
    }
  });
};
