const Bibit = require('../models/bibitModel');
const { errorHttp } = require('../middlewares/errorHandler');
const Kebun = require('../models/kebunModel');

const LIMIT_DEFAULT = 10;
const LIMIT_MAKS = 50;
const FIELD_SORT = ['kodeBibit', 'harga', 'createdAt'];
const FIELD_BOLEH_DIPILIH = ['namaPaket', 'operator', 'kuotaGb', 'masaAktifHari', 'harga', 'alamat', 'cabangId','createdAt'];

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman
function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

exports.create = async (req, res) => {
  try {
    const Bibit = await Bibit.create(req.body);
    res.status(201).json(bibit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res, next) => {
   const filter = {};
  if (req.query.kota) {
    filter['alamat.kota'] = String(req.query.kota);
  }
  if (req.query.kebunId) {
    const kebun = await Cabang.findOne({ _id: req.query.kebunId });
    filter.cabangId = kebun ? kebun._id : { $in: [] };
  }

  const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER);
  const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS);

  // Sorting: ?sort=namaPaket (naik) atau ?sort=-namaPaket (turun). Bawaan: terbaru dulu
  const sortParam = String(req.query.sort || '-createdAt');
  const arah = sortParam.startsWith('-') ? -1 : 1;
  const sortField = sortParam.replace(/^-/, '');
  if (!FIELD_SORT.includes(sortField)) {
    throw errorHttp(400, `sort hanya boleh: ${FIELD_SORT.join(', ')}`);
  }

  // Projection: ?fields=nama,nim
  let select = '';
  if (req.query.fields) {
    const fields = String(req.query.fields).split(',').map((f) => f.trim());
    if (!fields.every((f) => FIELD_BOLEH_DIPILIH.includes(f))) {
      throw errorHttp(400, `fields hanya boleh: ${FIELD_BOLEH_DIPILIH.join(', ')}`);
    }
    select = fields.join(' ');
  }

    const query = Dataplans.find(filter)
    .select(select)
    .sort({ [sortField]: arah, _id: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // populate() otomatis menambahkan cabangId ke hasil, jadi hanya dipanggil
  // bila cabangId memang diminta (atau bila tidak ada pemilihan field)
  if (!select || select.split(' ').includes('cabangId')) {
    query.populate('cabangId', 'cabang');
  }

  const [data, total] = await Promise.all([query, Dataplans.countDocuments(filter)]);

  res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
};

exports.getById = async (req, res) => {
  const data = await Dataplans.findById(req.params.id).populate('cabangId');
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await Dataplans.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: 'after', runValidators: true }
  );
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.remove = async (req, res) => {
  const data = await Dataplans.findByIdAndDelete(req.params.id);
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.status(204).send();
};