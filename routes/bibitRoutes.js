const express = require('express');
const router = express.Router();
const bibitController = require('../controllers/bibitController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', bibitController.getAll);
router.get('/:id', bibitController.getById);
router.post('/', cekApiKey, bibitController.create);
router.put('/:id', cekApiKey, bibitController.update);
router.delete('/:id', cekApiKey, bibitController.remove);

module.exports = router;