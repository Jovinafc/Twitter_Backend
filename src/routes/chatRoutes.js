const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { getChatHistory, sendMessage } = require('../controllers/chatController');

const router = express.Router();

router.get('/:userId', verifyToken, getChatHistory);

router.post('/send', verifyToken, sendMessage);

module.exports = router;
