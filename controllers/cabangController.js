const Operator = require('../models/cabangModel');

exports.create = async (req, res) => {
  try {
    const operator = await Operator.create(req.body);
    res.status(201).json(operator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  res.json(await Operator.find());
};