const mongoose = require('mongoose');

const cabangSchema = new mongoose.Schema({
  cabang: {type: String, required: [true, 'Cabang operator wajib diisi'], unique: true, trim: true}
});

module.exports = mongoose.model('Cabang', cabangSchema);