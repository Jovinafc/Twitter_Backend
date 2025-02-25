require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const socktetIo = require('socket.io')
const http = require('http')

const authRoutes = require('./src/routes/authRoutes')
const tweetRoutes = require('./src/routes/tweetRoutes')
const userRoutes = require('./src/routes/userRoutes');
const chatRoutes = require('./src/routes/chatRoutes')
const notificationRoutes = require('./src/routes/notificationRoutes')

const app = express();
const server = http.createServer(app);
const io = socktetIo(server);

app.use(cors())
app.use(helmet())
app.use(express.json())

// const MONGODB_URI = "mongodb+srv://jovinafc:V8M3W6qzsHZCfYDW@cluster0.5b0ze.mongodb.net/twitterclone?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("Mongo Connection error", err))

app.get('/', (req, res) => {
    res.send("Twitter clone backend is running")
})

app.use('/api/auth', authRoutes)
app.use('/api/tweets', tweetRoutes)
app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes)
app.use('/api/notification', notificationRoutes);

let activeUsers = {}

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('register', (userId) => {
        activeUsers[userId] = socket.id;
        console.log(`User ${userId} connected.`)
    })

    socket.on('sendMessage', ({ senderId, receiverId, message }) => {
        const receiverSocketId = activeUsers[receiverId];

        if(receiverSocketId){
            io.to(receiverSocketId).emit('receiveMessage', {
                senderId,
                message
            })
        }
    })

    socket.on('disconnect', () => {
        for(let userId in activeUsers){
            if(activeUsers[userId] === socket.id){
                delete activeUsers[userId];
                console.log(`User ${userId} disconnected.`);
                break;
            }
        }
    })

})

const PORT = 5000;
server.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});