require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Kebun = require('./models/kebunModel');
const Bibit = require('./models/bibitModel');

const NAMA_Tanaman = [
  { nama: 'Anggrek'},
  { nama: 'Mawar' },
  { nama: 'Lili'},
  { nama: 'Melati'},
  { nama: 'Tulip'},

];

const jenis= [
  'sayur',
  'buah',
  'hias',
];


async function main() {
  await mongoose.connect(process.env.DB_URI);
  await Bibit.deleteMany({});
  await Kebun.deleteMany({});

  // Membuat 5 data kebun
  const kebun = await Kebun.insertMany([
    { kode: 'KB01', nama: 'Kebun Talang Kelapa'},
    { kode: 'KB02', nama: 'Kebun Sukamaju'},
    { kode: 'KB03', nama: 'Kebun Harapan'},
    { kode: 'KB04', nama: 'Kebun Makmur'},
    { kode: 'KB05', nama: 'Kebun Sejahtera'}
  ]);

  // Membuat 15 data bibit
   const bibit = NAMA_Tanaman.map((paket, i) => ({
    kodeBibit: `B${String(i + 1).padStart(2, '0')}`,
    namaTanaman: paket.nama,
    stok: 100,
    jenis: jenis[i % jenis.length],
    perawatan: {
      media: String(3111 + i),
      penyiraman: KOTA[i % KOTA.length]
    },
    kebunId: Kebun[i % kebun.length]._id
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