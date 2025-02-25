const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { followUser, unfollowUser } = require('../controllers/userController');

const router = express.Router();

router.post('/:userId/follow', verifyToken, followUser)

router.post('/:userId/unfollow', verifyToken, unfollowUser);

module.exports = router;