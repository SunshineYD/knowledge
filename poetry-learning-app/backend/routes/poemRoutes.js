const express = require('express');
const router = express.Router();
const poemController = require('../controllers/poemController');
const protect = require('../middleware/auth');

router.post('/add', protect, poemController.addPoem);
router.get('/all', protect, poemController.getPoems);
router.get('/:id', protect, poemController.getPoem);
router.put('/:id', protect, poemController.updatePoem);
router.delete('/:id', protect, poemController.deletePoem);

module.exports = router;