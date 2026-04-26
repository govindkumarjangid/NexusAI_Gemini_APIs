import User from '../models/user.model.js';
import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';
import bcrypt from 'bcryptjs';
import wrapAsync from '../utils/wrapAsync.js';
import genrateToken from '../utils/generateToken.js';
import dotenv from 'dotenv';

dotenv.config();

export const registerUser = wrapAsync(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password)
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
        name,
        email,
        password: hashedPassword
    });

    await newUser.save();

    const token = genrateToken(newUser._id);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    });

    console.log(token, newUser)

    res.status(200).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            UpdatedAt: newUser.updatedAt,
            lastLogin: newUser.lastLogin
        }
    });
});

export const loginUser = wrapAsync(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'All fields are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user) {
        user.lastLogin = new Date();
        await user.save();
    }

    const token = genrateToken(user._id);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        success: true,
        message: 'Login successful', token, user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            UpdatedAt: user.updatedAt,
            lastLogin: user.lastLogin
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

export const deleteAccount = wrapAsync(async (req, res) => {
    const id = req.user._id;
    const password = req.body.password;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    await User.findByIdAndUpdate(id, { $set: { password: null } });

    await Chat.updateMany({ userId: id }, { $set: { userId: null } });
    await Message.updateMany({ userId: id }, { $set: { userId: null } });

    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Account deactivated successfully' });
});