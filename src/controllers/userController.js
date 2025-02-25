const User = require("../models/User");

exports.followUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if(userId === req.user.id){
            return res.status(400).json({ status: 'failed', message: "You can't follow yourself!" });   
        }

        const userToFollow = await User.findById(userId);

        if(!userToFollow){
            return res.status(404).json({ status: 'failed',  message: 'User not found' });
        }

        if(req.user.following.includes(userId)){
            return res.status(400).json({ status: 'failed', message: 'You are already following this user' });   
        }

        req.user.following.push(userId);
        await req.user.save();

        userToFollow.followers.push(req.user.id);
        await userToFollow.save();

        res.json({ status: 'success', message: 'User followed successfully', userToFollow });        

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.unfollowUser = async (req, res) => {
    try {
        const { userId } = req.params;

    // Ensure the user is not trying to unfollow themselves
    if (userId === req.user.id) {
      return res.status(400).json({ status: 'failed', message: "You can't unfollow yourself!" });
    }

    const userToUnfollow = await User.findById(userId);

    if (!userToUnfollow) {
        return res.status(404).json({ status: 'failed', message: 'User not found' });
    }
  
    if(!req.user.following.includes(userId)) {
        return res.status(400).json({ status: 'failed', message: 'You are not following this user' });
    }

    req.user.following.pull(userId);
    await req.user.save();

    userToUnfollow.followers.pull(req.user.id);
    await userToUnfollow.save();

    res.json({ status: 'success', message: 'User unfollowed successfully', userToUnfollow });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}