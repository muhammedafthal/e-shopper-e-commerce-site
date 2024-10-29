const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/:userId', getUserProfile);      // Get user profile
router.put('/:userId', updateUserProfile);    // Update user profile

module.exports = router;
