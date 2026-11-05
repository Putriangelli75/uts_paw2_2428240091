const mongoose = require('mongoose');

const alamatSchema = new mongoose.Schema({
  media: String,
  penyiraman: String,
}, { _id: false });

const bibitSchema = new mongoose.Schema({
  kodeBibit: { type: String, required: [true, 'kode bibit wajib diisi'], trim: true },
  namaTanaman: { type: String, required: [true, 'nama tanaman wajib diisi'], trim: true },
  stok: { type: Number, required: [true, 'stok wajib diisi'], min: 0 },
  jenis: { type: String, required: [true, 'jenis wajib diisi'], min: 0 },
  perawatan: alamatSchema,
  kebunId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cabang' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bibit', bibitSchema);