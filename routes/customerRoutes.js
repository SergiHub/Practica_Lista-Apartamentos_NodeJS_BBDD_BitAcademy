const express = require('express');

const router = express.Router();

const customerController = require('../controllers/customerController');

router.get('/', customerController.getAllApartments);
router.get('/apartment/:idApartment', customerController.getDetailedApartment);

module.exports = router;