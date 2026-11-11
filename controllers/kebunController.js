const Kebun = require('../models/kebunModel');

exports.create = async (req, res) => {
  const { kode, nama } = req.body;
  const kebun = await Kebun.create({ kode, nama });
  res.status(201).json(kebun);
};

exports.getAll = async (req, res) => {
  res.json((await Kebun.find()).toSorted({kode: 1}));
};