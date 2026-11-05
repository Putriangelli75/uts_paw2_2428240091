require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Kebun = require('./models/kebunModel');
const Bibit = require('./models/bibitModel');

const NAMA_Tanaman = [
  { nama: 'Anggrek'},
  { nama: 'Mawar' },
  { nama: 'Lili'},
  { nama: 'Melati', },
  { nama: '', kuota: 30 },

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

  // Membuat 5 data cabang
  const kebun = await Kebun.insertMany([
    { kebun: '1'},
    { kebun: '2'},
    { cabang: '3'},
    { cabang: '4'},
    { cabang: '5'}
  ]);

  // Membuat 15 data paket internet
   const bibit = NAMA_Tanaman.map((paket, i) => ({
    kodeBibit: bibit[i]
    namaTanaman: paket.nama,
    jenis: Kebun[i % kebun.length],
    kuotaGb: paket.kuota,
    masaAktifHari: 30,
    harga: (i + 1) * 10000,
    alamat: {
      kodePos: String(3111 + i),
      kota: KOTA[i % KOTA.length]
    },
    kebunId: Kebun[i % cabang.length]._id
  }));

  await Bibit.insertMany(bibit);

  console.log(
    `Seed selesai: ${bibit.length} cabang, ${bibit.length} bibit`
  );

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});