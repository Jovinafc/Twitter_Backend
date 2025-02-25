const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_TOKEN = "helloworldsecretkey"

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email })
        if(existingUser){
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            JWT_TOKEN,
            { 'expiresIn' : '1h'}
        );

        res.status(201).json({ status: 'success', message: 'User registered successfully', authToken: token });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({ status: 'failed', message: 'User does not exists' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ status: 'failed', message: 'Password is not proper' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_TOKEN,
            { 'expiresIn' : '1h'}
        );

        res.status(201).json({ status: 'success', message: 'User login successfully', authToken: token });

    } catch (error) {
        res.status(500).json({ message: 'Server error for login route' });   
    }
}