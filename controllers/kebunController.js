const Kebun = require('../models/kebunModel');

exports.create = async (req, res) => {
  try {
    const kebun = await Kebun.create(req.body);
    res.status(201).json(operator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  res.json(await Operator.find());
};