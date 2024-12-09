const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    toggleBlockUser,
    deleteUser } = require('../controllers/usercontroller');

const router = express.Router();

router.get('/', getUserProfile);      // Get user profile
router.put('/:userId', updateUserProfile);    // Update user profile
router.put('/block/:id', toggleBlockUser); // Route to block/unblock user
router.delete('/delete/:id', deleteUser); // Route to delete user


module.exports = router;
