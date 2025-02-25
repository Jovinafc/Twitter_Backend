const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { createTweet, getTweets, likeTweet, commentOnTweet, createTweetWithMedia } = require('../controllers/tweetController');
const upload = require('../utils/upload');

const router = express.Router();

// router.post('/', verifyToken, createTweet);

router.post('/', verifyToken, upload.array('media', 5), createTweetWithMedia);

router.get('/', getTweets);

router.post('/:id/like', verifyToken, likeTweet);

router.post('/:id/comment', verifyToken, commentOnTweet);

module.exports = router;

