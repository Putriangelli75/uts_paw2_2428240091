const mongoose = require('mongoose');

const alamatSchema = new mongoose.Schema({
  media: String,
  penyiraman: String,
}, { _id: false });

const bibitSchema = new mongoose.Schema({
  kodeBibit: { type: String, required: [true, 'kode bibit wajib diisi'], unique: true, trim: true },
  namaTanaman: { type: String, required: [true, 'nama tanaman wajib diisi'], trim: true },
  stok: { type: Number, required: [true, 'stok wajib diisi'], min: 0 },
  jenis: { type: String, required: [true, 'jenis wajib diisi'], trim: true },
  perawatan: { type: alamatSchema, required: [true, 'perawatan wajib diisi'] },
  kebunId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kebun' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bibit', bibitSchema);