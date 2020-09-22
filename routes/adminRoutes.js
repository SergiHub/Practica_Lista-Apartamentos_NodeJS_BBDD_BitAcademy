const express = require('express');

const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/add-new', adminController.getNewApartment);
router.post('/add-new', adminController.postNewApartment);
router.post('/edit-apartment', adminController.postEditApartment);

router.get('/', adminController.getAllApartments);
router.get('/apartment/:idApartment', adminController.getDetailedApartment);

router.get('/apartment/:idApartment/edit', adminController.getEditApartment);
router.get('/apartment/:idApartment/delete', adminController.getDeleteApartment);

module.exports = router;