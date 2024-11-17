const jwt = require('jsonwebtoken');
const User = require('./models/users');
const config = require('./config');

const Auth = {
      isAuth: async (req, res, next) => {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        console.log('Received token:', token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        try {
            const decodedToken = jwt.verify(token, config.JWT_SECRET);
            req.userId = decodedToken.userId;
            next();
        } catch (error) {
            return res.status(401).json({ message: error.message });
        }
    },
    
    isAdmin: async (req, res, next) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (user.role !== 'admin') {
                return res.status(403).json({ message: "Forbidden" });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = Auth;