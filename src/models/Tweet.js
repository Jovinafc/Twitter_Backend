const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minLength: 1
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    media: [
        {
            type: String
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('Tweet', TweetSchema);