const express = require('express');
const { updateProfile, getProfileById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.get('/:userId', getProfileById);

module.exports = router;
