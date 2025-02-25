const Chat = require("../models/Chat");


exports.getChatHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const chat = await Chat.findOne({
            participants: { $all: [req.user.id, userId ] }
        }).populate('messages.sender', 'username profilePicture');

        if(!chat){
            return res.status(404).json({ status: 'failed', message: 'No chat history found' });
        }

        res.json( {status: 'success', data: chat.messages })
    } catch (err) {
        console.error(err);
    res.status(500).json({ message: 'Server error' });
    }
}

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;

        if(!message){
            return res.status(400).json({ status: 'failed', message: 'Message cannot be empty' });
        }

        let chat = await Chat.findOne({ 
            participants: { $all: [ req.user.id, receiverId ]}
        })

        if(!chat){
            chat = new Chat({
                participants: [req.user.id, receiverId],
                messages: [],
            })
            await chat.save();
        }

        chat.messages.push({
            sender: req.user.id,
            message,
            timestamp: new Date()
        });

        await chat.save();

        const notification = new Notification({
            userId: receiverId,
            message: 'You have a new message from ' + res.user.username,
            read: false,
            timestamp: new Date()
        })

        await notification.save();

        const receiverSocketId = activeUsers[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newNotification', notification);
        }

        res.json({ status: 'success', message: 'Message sent successfully', data: chat });


    } catch (err) {
        console.error(err);
    res.status(500).json({ message: 'Server error' });
    }
}

