
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Kebun = require('./models/kebunModel');
const Bibit = require('./models/bibitModel');

const NAMA_TANAMAN = [
  // Tanaman hias
  { nama: 'Anggrek', jenis: 'hias' },
  { nama: 'Mawar', jenis: 'hias' },
  { nama: 'Lili', jenis: 'hias' },
  { nama: 'Melati', jenis: 'hias' },
  { nama: 'Tulip', jenis: 'hias' },

  // Tanaman sayur
  { nama: 'Bayam', jenis: 'sayur' },
  { nama: 'Kangkung', jenis: 'sayur' },
  { nama: 'Sawi', jenis: 'sayur' },
  { nama: 'Tomat', jenis: 'sayur' },

  // Tanaman buah
  { nama: 'Jeruk', jenis: 'buah' },
  { nama: 'Apel', jenis: 'buah' },
  { nama: 'Mangga', jenis: 'buah' },
  { nama: 'Pisang', jenis: 'buah' },
  { nama: 'Durian', jenis: 'buah' }
];

const jenis = [
  'sayur',
  'buah',
  'hias',
];

const MEDIA = [
  'Tanah',
  'Hidroponik',
  'Sekam',
  'Cocopeat',
  'Kompos'
];

const PENYIRAMAN = [
  'Setiap hari',
  'Dua kali sehari',
  'Setiap dua hari',
  'Tiga kali seminggu',
  'Seminggu sekali'
];


async function main() {
  await mongoose.connect(process.env.DB_URI);

  await Bibit.deleteMany({});
  await Kebun.deleteMany({});

  // Membuat 5 data kebun
  const kebun = await Kebun.insertMany([
    { kode: 'KB01', nama: 'Kebun Talang Kelapa' },
    { kode: 'KB02', nama: 'Kebun Sukamaju' },
    { kode: 'KB03', nama: 'Kebun Harapan' },
    { kode: 'KB04', nama: 'Kebun Makmur' },
    { kode: 'KB05', nama: 'Kebun Sejahtera' }
  ]);

  // Membuat 14 data bibit
  const bibit = NAMA_TANAMAN.map((tanaman, i) => ({
    kodeBibit: `BBT-${String(i + 1).padStart(2, '0')}`,
    namaTanaman: tanaman.nama,
    stok: (i % 5) + 1,
    jenis: tanaman.jenis,
    perawatan: {
      media: MEDIA[i % MEDIA.length],
      penyiraman: PENYIRAMAN[i % PENYIRAMAN.length]
    },
    kebunId: kebun[i % kebun.length]._id
  }));

  await Bibit.insertMany(bibit);

  console.log(
    `Seed selesai: ${kebun.length} kebun, ${bibit.length} bibit`
  );

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
