import Message from '../models/message.model.js';
import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';
import wrapAsync from '../utils/wrapAsync.js';

// send message
const sendMessage = wrapAsync(async (req, res) => {
    const { chatId } = req.params;
    const { content } = req.body;

    // Check if chat exists
    const chat = await Chat.findById(chatId);

    if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
    }

    // Create new message
    const newMessage = new Message({ chatId, role: 'user', content });
    await newMessage.save();
    // Add message to chat
    chat.messages.push({ messageId: newMessage._id, role: 'user', content });
    await chat.save();
    // Here you would typically call your AI assistant service to get a response
    // For demonstration, we'll just echo the user's message
    const assistantResponse = `Echo: ${content}`;
    // Create assistant message
    const assistantMessage = new Message({ chatId, role: 'assistant', content: assistantResponse });
    await assistantMessage.save();

    // Add assistant message to chat
    chat.messages.push({ messageId: assistantMessage._id, role: 'assistant', content: assistantResponse });
    await chat.save();

    res.status(200).json({ message: 'Message sent successfully', assistantResponse });
});

// get all messages for a chat
const getMessagesByChat = wrapAsync(async (req, res) => {
    const { chatId } = req.params;
    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });

    }
    // Get all messages for the chat
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.status(200).json({ messages });
});

// get messge by id
const getMessageById = wrapAsync(async (req, res) => {
    const { messageId } = req.params;
    // Check if message exists
    const message = await Message.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message });
});

// delete message by id
const deleteMessageById = wrapAsync(async (req, res) => {
    const { messageId } = req.params;
    // Check if message exists
    const message = await Message.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }
    await message.remove();
    res.status(200).json({ message: 'Message deleted successfully' });
});

//edit message by id
const editMessageById = wrapAsync(async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;
    // Check if message exists
    const message = await Message.findById(messageId);
    if (!message) {
        return res.status(404).json({ message: 'Message not found' });
    }
    message.content = content;
    await message.save();
    res.status(200).json({ message: 'Message edited successfully' });
});

// get all messages for a user
const getMessagesByUser = wrapAsync(async (req, res) => {
    const { userId } = req.params;
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Get all chats for the user
    const chats = await Chat.find({ userId });
    const chatIds = chats.map(chat => chat._id);
    // Get all messages for the user's chats
    const messages = await Message.find({ chatId: { $in: chatIds } }).sort({ createdAt: 1 });
    res.status(200).json({ messages });

});

export default {
    sendMessage,
    getMessagesByChat,
    getMessageById,
    deleteMessageById,
    editMessageById,
    getMessagesByUser
};