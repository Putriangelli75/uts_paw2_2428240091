# Dokumentasi RESTful API Kebun Bibit

## 1. Konsep Embedding dan Referencing

### Embedding
Digunakan untuk menyimpan data yang saling berhubungan dalam satu dokumen (subdokumen), sehingga data dapat diakses secara langsung tanpa melakukan relasi antarkoleksi.

### Referencing
Digunakan untuk menghubungkan data dari koleksi yang berbeda menggunakan ObjectId sebagai referensi. Dengan demikian, data dapat dipisahkan agar tidak terjadi duplikasi dan lebih mudah dikelola.

## 2. Daftar Pengujian Endpoint API

| No | Request | Status Diharapkan | Status Didapat | Sesuai |
|---:|---|---|---|:---:|
| 1 | `POST /kebun` | 201 | 201 | Ya |
| 2 | `POST /kebun` dengan kode yang sama | 409 | 409 | Ya |
| 3 | `GET /kebun` | 200 | 200 | Ya |
| 4 | `POST /bibit` | 201 | 201 | Ya |
| 5 | `POST /bibit` dengan nilai unik yang sama | 409 | 409 | Ya |
| 6 | `POST /bibit` tanpa teks | 400 + detail | 400 + detail | Ya |
| 7 | `POST /bibit` dengan angka di bawah minimum | 400 | 400 | Ya |
| 8 | `GET /bibit` | 200, array | 200 | Ya |
| 9 | `GET /bibit?jenis=sayur` | 200, hanya data yang cocok | 200 | Ya |
| 10 | `GET /bibit?jenis=tidak_ada` | 200, array kosong (`[]`) | 200, [] | Ya |
| 11 | `GET /bibit?sort=stok` | 200, urut menaik | 200 | Ya |
| 12 | `GET /bibit/:id` | 200, referensi ter-*populate* | 200 | Ya |
| 13 | `GET /bibit/:id` (ID tidak ada) | 404 | 404 | Ya |
| 14 | `GET /bibit/abc` | 400 | 400 | Ya |
| 15 | `GET /rute-tidak-ada` | 404 | 404 | Ya |

## 3. Cara Menjalankan Aplikasi

### A. Persiapan
Pastikan perangkat sudah menginstal:
- Node.js
- npm
- MongoDB

### B. Clone atau Buka Project
Buka folder project melalui Visual Studio Code atau terminal.

### C. Instalasi Dependencies
Jalankan perintah berikut:

```bash
npm install
```

### D. Konfigurasi Environment
Buat file `.env` pada direktori utama project dan sesuaikan konfigurasi MongoDB.

Contoh:

```env
PORT=3000
DB_URI=mongodb://127.0.0.1:27017/paw2uts
```

Sesuaikan nama variabel dengan konfigurasi yang digunakan pada project.

### E. Menjalankan Server
Jalankan perintah:

```bash
npm run dev
```

Jika berhasil, server akan berjalan pada:

```text
http://localhost:3000
```

### F. Pengujian API
Buka aplikasi Postman, kemudian lakukan pengujian endpoint berikut:

- `POST /kebun` untuk menambahkan data kebun.
- `GET /kebun` untuk menampilkan seluruh data kebun.
- `POST /bibit` untuk menambahkan data bibit.
- `GET /bibit` untuk menampilkan seluruh data bibit.
- `GET /bibit/:id` untuk menampilkan detail bibit berdasarkan ID.

Pastikan MongoDB sudah berjalan sebelum melakukan pengujian API.
