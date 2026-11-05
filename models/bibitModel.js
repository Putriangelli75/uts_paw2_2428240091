const mongoose = require('mongoose');

const alamatSchema = new mongoose.Schema({
  media: String,
  penyiraman: String,
}, { _id: false });

const bibitSchema = new mongoose.Schema({
  kodeBibit: { type: String, required: [true, 'nama paket wajib diisi'], trim: true },
  namaTanaman: { type: String, required: [true, 'operator wajib diisi'], trim: true },
  stok: { type: Number, required: [true, 'kuota GB wajib diisi'], min: 0 },
  jenis: { type: String, required: [true, 'masa aktif hari wajib diisi'], min: 0 },
  perawatan: { type: String, required: [true, 'harga wajib diisi'], unique: true, min: 0 },
  alamat: alamatSchema,
  kebunId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cabang' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('bibit', bibitSchema);