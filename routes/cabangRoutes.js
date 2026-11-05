const express = require('express');
const router = express.Router();
const cabangController = require('../controllers/cabangController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', cabangController.getAll);
// router.get('/:id', cabangController.getById);
router.post('/', cekApiKey, cabangController.create);

module.exports = router;