const express = require('express');
const router = express.Router();
const kebunController = require('../controllers/kebunController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', kebunController.getAll);
// router.get('/:id', kebunController.getById);
router.post('/', cekApiKey, kebunController.create);

module.exports = router;