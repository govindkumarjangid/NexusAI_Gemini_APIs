// create registerUser, loginUser, logoutUser functions in user.controller.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import wrapAsync from '../utils/wrapasync.js';
import genrateToken from '../utils/generateToken.js';
import dotenv from 'dotenv';

dotenv.config();

export const registerUser = wrapAsync(async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password)
        return res.status(400).json({ message: 'All fields are required' });

    if (password.length < 6)
        return res.status(400).json({ message: 'Password must be at least 6 characters' });

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        return res.status(400).json({ message: 'Invalid email format' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
        return res.status(400).json({ message: 'User already exists' });


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
});

export const loginUser = wrapAsync(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'All fields are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = genrateToken(user._id);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
        success: true,
        message: 'Login successful', token, user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
});

export const logoutUser = wrapAsync(async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ success: true, message: 'Logout successful' });
});