const Tweet = require('../models/Tweet');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2

exports.createTweet = async (req, res) => {
    try {
        const { text, media } = req.body;
        
        const newTweet = new Tweet({
            text,
            media,
            user: req.user.id
        });

        await newTweet.save();
        res.status(201).json({ status: 'success', message: 'Tweet created successfully', tweet: newTweet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.createTweetWithMedia = async (req, res) => {
    try {
        const { text } = req.body;

        const media = [];
        if(req.files) {
            for(let i=0; i<req.files.length; i++){
                const file = req.files[i];
                const result = await cloudinary.uploader.upload(file.path);
                media.push(result.secure_url);
            }
        }
        
        const newTweet = new Tweet({
            text,
            media,
            user: req.user.id
        });

        await newTweet.save();
        res.status(201).json({ status: 'success', message: 'Tweet created successfully', tweet: newTweet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find()
            .populate('user', 'username profilePicture')
            .sort({ createdAt: -1 })

        res.json({status: 'success', data: tweets});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getTweetsOfFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('following');

        const followedUserIds = user.following.map(followedUser => followedUser._id);

        const tweets = await Tweet.find({ user: { $in: followedUserIds }})
            .populate('user', 'username profilePicture')
            .sort({ createdAt: -1 });

        res.json({ status: success, data: tweets })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
} 

exports.likeTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);

        if(!tweet){
            return res.status(404).json({ status: 'failed', message: 'Tweet not found' });
        }

        if(tweet.likes.includes(req.user.id)){
            return res.status(400).json({ status: 'failed', message: 'You already liked this tweet' });
        }

        tweet.likes.push(req.user.id);
        await tweet.save();

        res.status(200).json({ status: 'success', message: 'Tweet liked successfully', tweet });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.commentOnTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);

        if(!tweet){
            return res.status(404).json({ status: 'failed', message: 'Tweet not found' });
        }

        const { text } = req.body;
        const comment = {
            user: req.user.id,
            text
        }

        tweet.comments.push(comment);
        await tweet.save();

        res.status(200).json({ status: 'success', message: 'Comment added successfully', tweet });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}