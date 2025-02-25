const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get notifications for a user
router.get('/', verifyToken, getNotifications);

// Mark notification as read
router.patch('/read/:notificationId', verifyToken, markAsRead);

module.exports = router;
