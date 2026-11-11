const mongoose = require('mongoose');
const Bibit = require('../models/bibitModel');
const { errorHttp } = require('../middlewares/errorHandler');
const Kebun = require('../models/kebunModel');

const LIMIT_DEFAULT = 10;
const LIMIT_MAKS = 50;
const FIELD_SORT = ['kodeBibit', 'namaTanaman', 'stok', 'jenis', 'createdAt'];
const FIELD_BOLEH_DIPILIH = ['kodeBibit', 'namaTanaman', 'stok', 'jenis', 'perawatan', 'kebunId', 'createdAt'];

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman
function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

exports.create = async (req, res) => {
  const { kodeBibit, namaTanaman, stok, jenis, perawatan, kebunId } = req.body;
  const bibit = await Bibit.create({ kodeBibit, namaTanaman, stok, jenis, perawatan, kebunId });
  res.status(201).json(bibit);
};

exports.getAll = async (req, res, next) => {
  // Filtering
  const filter = {};
  if (req.query.jenis) {
    filter['jenis'] = String(req.query.jenis);
  }
  if (req.query.kebun) {
    const kebun = await Kebun.findOne({ kode: String(req.query.kebun).toUpperCase() });
    filter.kebunId = kebun ? kebun._id : { $in: [] };
  }

  // pagination dengan batas maksimum
  const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER);
  const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS);

  // Sorting: ?sort=namaTanaman (naik) atau ?sort=-namaTanaman (turun). Bawaan: terbaru dulu
  const sortParam = String(req.query.sort || '-createdAt');
  const arah = sortParam.startsWith('-') ? -1 : 1;
  const sortField = sortParam.replace(/^-/, '');
  if (!FIELD_SORT.includes(sortField)) {
    throw errorHttp(400, `sort hanya boleh: ${FIELD_SORT.join(', ')}`);
  }

  // Projection: ?fields=kodeBibit,namaTanaman,stok. Bawaan: semua field
  let select = '';
  if (req.query.fields) {
    const fields = String(req.query.fields).split(',').map((f) => f.trim());
    if (!fields.every((f) => FIELD_BOLEH_DIPILIH.includes(f))) {
      throw errorHttp(400, `fields hanya boleh: ${FIELD_BOLEH_DIPILIH.join(', ')}`);
    }
    select = fields.join(' ');
  }

  const query = Bibit.find(filter)
    .select(select)
    .sort({ [sortField]: arah, _id: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // populate() otomatis menambahkan kebunId ke hasil, jadi hanya dipanggil
  // bila kebunId memang diminta (atau bila tidak ada pemilihan field)
  if (!select || select.split(' ').includes('kebunId')) {
    query.populate('kebunId', 'Kebun');
  }

  const [data, total] = await Promise.all([query, Bibit.countDocuments(filter)]);

  res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
};

exports.getById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw errorHttp(400, 'Format ID bibit tidak valid');
  }
  
  const data = await Bibit.findById(req.params.id).populate('kebunId');
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.update = async (req, res) => {
  const { kodeBibit, namaTanaman, stok, jenis, perawatan, kebunId } = req.body;
  const data = await Bibit.findByIdAndUpdate(
    req.params.id,
    { kodeBibit, namaTanaman, stok, jenis, perawatan, kebunId },
    { returnDocument: 'after', runValidators: true }
  );
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.remove = async (req, res) => {
  const data = await Bibit.findByIdAndDelete(req.params.id);
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.status(204).send();
};