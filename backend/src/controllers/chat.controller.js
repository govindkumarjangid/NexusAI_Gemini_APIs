import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';
import wrapAsync from '../utils/wrapAsync.js';
import Message from '../models/message.model.js';

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

export {
    createChat,
    getChatsByUser,
    deleteChat
};