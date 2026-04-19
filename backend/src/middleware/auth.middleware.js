import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer '))
            return res.status(401).json({ message: 'Access Denied: No token provided' });

        const token = authHeader.split(' ')[1];


        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user)
            return res.status(401).json({ message: 'Unauthorized: User no longer exists' });

        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Session Expired. Please login again.',
                code: 'TOKEN_EXPIRED'
            });
        }
        if (error.name === 'JsonWebTokenError')
            return res.status(401).json({ message: 'Invalid Token' });

        console.error("Auth Middleware Error:", error);
        return res.status(500).json({ message: 'Internal Server Error during authentication' });
    }
};

export default authMiddleware;