import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';
import wrapAsync from '../utils/wrapAsync.js';

// create new chat
const createChat = wrapAsync(async (req, res) => {
    const { userId } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Create new chat
    const newChat = new Chat({ userId, messages: [] });
    await newChat.save();

    res.status(201).json({ message: 'Chat created successfully', chatId: newChat._id });
});

// get all chats for a user
const getChatsByUser = wrapAsync(async (req, res) => {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Get all chats for the user
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ chats });
});

// add message to chat
const addMessageToChat = wrapAsync(async (req, res) => {

    const { chatId } = req.params;
    const { messageId, role, content } = req.body;

    // Check if chat exists
    const chat = await Chat.findById(chatId);

    if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
    }

    // Add message to chat
    chat.messages.push({ messageId, role, content });
    await chat.save();

    res.status(200).json({ message: 'Message added to chat successfully' });

});

// update chat with new message
const updateChatWithMessage = wrapAsync(async (req, res) => {
    const { chatId } = req.params;
    const { messageId, role, content } = req.body;

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
    }
    // Update chat with new message
    chat.messages.push({ messageId, role, content });
    await chat.save();
    res.status(200).json({ message: 'Chat updated with new message successfully' });
});

// delete chat and all its messages
const deleteChat = wrapAsync(async (req, res) => {
    const { chatId } = req.params;
    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
    }

    // Delete chat
    await Chat.findByIdAndDelete(chatId);
    res.status(200).json({ message: 'Chat deleted successfully' });
});


export {
    createChat,
    getChatsByUser,
    addMessageToChat,
    updateChatWithMessage,
    deleteChat
};