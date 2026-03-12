const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');
const protect = require('../middleware/auth');

router.post('/:childId/:poemId', protect, checkinController.checkinPoem);
router.get('/child/:childId', protect, checkinController.getChildCheckins);
router.put('/:childId/:poemId/familiarity', protect, checkinController.updateFamiliarity);

module.exports = router;