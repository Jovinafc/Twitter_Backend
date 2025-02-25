const jwt = require('jsonwebtoken')

const JWT_TOKEN = "helloworldsecretkey"

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_TOKEN);

        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ status: 'failed', message: 'Token is not valid' });
    }
}

module.exports = verifyToken