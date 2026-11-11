const mongoose = require('mongoose');

const kebunSchema = new mongoose.Schema({
  kode: {type: String, required: [true, 'Kode kebun wajib diisi'], unique: true, trim: true},
  nama: {type: String, required: [true, 'Nama kebun wajib diisi'], trim: true}
});

module.exports = mongoose.model('Kebun', kebunSchema);