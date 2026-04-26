import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';
import wrapAsync from '../utils/wrapAsync.js';
import Message from '../models/message.model.js';

import crypto from 'crypto';

// create new chat
const createChat = wrapAsync(async (req, res) => {
    const { userId } = req.body;
    console.log(userId)

    const user = await User.findById(userId);
    if (!user)
        return res.status(404).json({ message: 'User not found' });

    const newChat = new Chat({ userId, messages: [] });
    console.log(newChat)
    await newChat.save();

    res.status(201).json({ success: true, message: 'Chat created successfully', chat: newChat });
});

// get all chats for a user
const getChatsByUser = wrapAsync(async (req, res) => {

    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user)
        return res.status(404).json({ message: 'User not found' });

    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, message: 'Chats fetched successfully', chats });
});

// delete chat and all its messages
const deleteChat = wrapAsync(async (req, res) => {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat)
        return res.status(404).json({ message: 'Chat not found' });

    await Message.deleteMany({ chatId });

    await Chat.findByIdAndDelete(chatId);
    res.status(200).json({ success: true, message: 'Chat and its messages deleted successfully' });
});

// share/unshare chat
const shareChat = wrapAsync(async (req, res) => {
    const { chatId } = req.params;
    const { isShared } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat)
        return res.status(404).json({ message: 'Chat not found' });

    chat.isShared = isShared;
    if (isShared && !chat.shareId) {
        chat.shareId = crypto.randomBytes(16).toString('hex');
    }

    await chat.save();
    res.status(200).json({ success: true, message: isShared ? 'Chat shared successfully' : 'Chat unshared successfully', chat });
});

// get shared chat
const getSharedChat = wrapAsync(async (req, res) => {
    const { shareId } = req.params;
    const chat = await Chat.findOne({ shareId, isShared: true });

    if (!chat)
        return res.status(404).json({ message: 'Shared chat not found or link has expired' });

    res.status(200).json({ success: true, message: 'Shared chat fetched successfully', chat });
});

export {
    createChat,
    getChatsByUser,
    deleteChat,
    shareChat,
    getSharedChat
};