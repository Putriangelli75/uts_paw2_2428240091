require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Cabang = require('./models/cabangModel');
const Dataplans = require('./models/dataplansModel');

const NAMA_PAKET = [
  { nama: 'Internet Bulanan 10GB', kuota: 10 },
  { nama: 'Internet Bulanan 15GB', kuota: 15 },
  { nama: 'Internet Bulanan 20GB', kuota: 20 },
  { nama: 'Internet Bulanan 25GB', kuota: 25 },
  { nama: 'Internet Bulanan 30GB', kuota: 30 },
  { nama: 'Internet Bulanan 40GB', kuota: 40 },
  { nama: 'Internet Bulanan 50GB', kuota: 50 },
  { nama: 'Internet Bulanan 75GB', kuota: 75 },
  { nama: 'Internet Bulanan 100GB', kuota: 100 },
  { nama: 'Internet Bulanan 120GB', kuota: 120 },
  { nama: 'Internet Bulanan 150GB', kuota: 150 },
  { nama: 'Internet Bulanan 200GB', kuota: 200 },
  { nama: 'Internet Bulanan 250GB', kuota: 250 },
  { nama: 'Internet Bulanan 300GB', kuota: 300 },
  { nama: 'Internet Bulanan 500GB', kuota: 500 }
];

const KOTA = [
  'Palembang',
  'Indralaya',
  'Prabumulih',
  'Lubuklinggau',
  'Muara Enim',
];

const OPERATOR = [
  'Telkomsel',
  'Indosat',
  'XL',
  'Three',
  'Smartfren'
];

async function main() {
  await mongoose.connect(process.env.DB_URI);
  await Dataplans.deleteMany({});
  await Cabang.deleteMany({});

  // Membuat 5 data cabang
  const cabang = await Cabang.insertMany([
    { cabang: '1'},
    { cabang: '2'},
    { cabang: '3'},
    { cabang: '4'},
    { cabang: '5'}
  ]);

  // Membuat 15 data paket internet
   const dataplans = NAMA_PAKET.map((paket, i) => ({
    namaPaket: paket.nama,
    operator: OPERATOR[i % OPERATOR.length],
    kuotaGb: paket.kuota,
    masaAktifHari: 30,
    harga: (i + 1) * 10000,
    alamat: {
      kodePos: String(3111 + i),
      kota: KOTA[i % KOTA.length]
    },
    cabangId: cabang[i % cabang.length]._id
  }));

  await Dataplans.insertMany(dataplans);

  console.log(
    `Seed selesai: ${cabang.length} cabang, ${dataplans.length} dataplans`
  );

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});