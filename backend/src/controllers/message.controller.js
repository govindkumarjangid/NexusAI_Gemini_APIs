import Message from '../models/message.model.js';
import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';
import wrapAsync from '../utils/wrapAsync.js';
import genAI from '../configs/genAI.js';

const sendMessage = wrapAsync(async (req, res) => {
    const { chatId } = req.params;
    const { content } = req.body;


    // Check if chat exists
    const chat = await Chat.findById(chatId).populate('messages.messageId');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Save user message
    const newMessage = new Message({ chatId, role: 'user', content });
    await newMessage.save();



    chat.messages.push({ messageId: newMessage._id, role: 'user', content });
    await chat.save();



    // Set SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullAssistantResponse = "";

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

        const formattedMessages = chat.messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Remove the latest user message
        formattedMessages.pop();

        const chatSession = model.startChat({
            history: formattedMessages,
        });

        const result = await chatSession.sendMessageStream(content);

        // Await the stream properly
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
                console.log(chunkText)
                fullAssistantResponse += chunkText;
                res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
            }
        }

        // SAVE TO DB AFTER STREAM IS COMPLETE
        const assistantMessage = new Message({ chatId, role: 'assistant', content: fullAssistantResponse });
        await assistantMessage.save();

        chat.messages.push({ messageId: assistantMessage._id, role: 'assistant', content: fullAssistantResponse });
        await chat.save();

        console.log(assistantMessage);

        // End the stream cleanly
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        return res.end();

    } catch (error) {
        console.error("Stream Error:", error);
        res.write(`data: ${JSON.stringify({ error: "Something went wrong" })}\n\n`);
        return res.end();
    }
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