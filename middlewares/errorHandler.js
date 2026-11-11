
function errorHttp(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

function notFoundHandler(req, res, next) {
    next(errorHttp(404, `Rute ${req.method} ${req.originalUrl} tidak ditemukan`));
}

function errorHandler(err, req, res, next) {

    // 1. JSON rusak dari client
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            message: 'Format JSON tidak valid',
            detail: ['Periksa kembali format JSON pada request body']
        });
    }

    // 2. POST tanpa body
    if (
        req.method === 'POST' &&
        (!req.body || Object.keys(req.body).length === 0)
    ) {
        return res.status(400).json({
            message: 'Data tidak boleh kosong',
            detail: ['Request body wajib diisi']
        });
    }

    // 3. ID tidak sesuai format ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({
            message: `Nilai '${err.value}' tidak valid untuk field ${err.path}`
        });
    }

    // 4. Pelanggaran aturan Schema (required, enum, dll.)
    if (err.name === 'ValidationError') {
        const detail = Object.values(err.errors).map((e) =>
            e.name === 'CastError'
                ? `Nilai untuk ${e.path} tidak valid`
                : e.message
        );

        return res.status(400).json({
            message: 'Data tidak valid',
            detail
        });
    }

    // 5. Pelanggaran unique (kode error MongoDB 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || err.keyValue || {})[0];

        const message = field
            ? `Nilai ${field} sudah dipakai`
            : 'Data duplikat';

        return res.status(409).json({
            message
        });
    }

    // 6. Error yang sengaja dilempar lewat errorHttp()
    if (err.status) {
        return res.status(err.status).json({
            message: err.message
        });
    }

    // 7. Kesalahan server lainnya
    console.error(err);

    return res.status(500).json({
        message: 'Terjadi kesalahan pada server'
    });
}

module.exports = {
    errorHttp,
    notFoundHandler,
    errorHandler
};
