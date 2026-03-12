const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController');
const protect = require('../middleware/auth');

router.post('/add', protect, childController.addChild);
router.get('/all', protect, childController.getChildren);
router.put('/:id', protect, childController.updateChild);
router.delete('/:id', protect, childController.deleteChild);

module.exports = router;