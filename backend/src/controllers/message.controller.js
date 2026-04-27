import Message from '../models/message.model.js';
import Chat from '../models/chat.model.js';
import wrapAsync from '../utils/wrapAsync.js';
import genAI from '../configs/genAI.js';
import axios from 'axios';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// upload image to Cloudinary
const uploadImage = wrapAsync(async (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: 'No image uploaded' });
    // console.log(req.file.secure_url)
    res.status(200).json({
        message: 'Image uploaded successfully',
        url: req.file.secure_url
    });
});

// send message in a chat and get streaming response from Gemini
const sendMessage = wrapAsync(async (req, res) => {
    const { chatId } = req.params;
    const { content, imageUrl } = req.body;
    // console.log("chatId", chatId)
    // console.log("content", content)
    // console.log("imageUrl", imageUrl)

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const newMessage = new Message({ chatId, role: 'user', content, imageUrl });
    await newMessage.save();
    // console.log("New Message:", newMessage);

    chat.messages.push({ messageId: newMessage._id, role: 'user', content, imageUrl });

    // Auto-update title if it's still "New Chat" and this is the first message with content
    if (chat.title === 'New Chat' && content) {
        chat.title = content.substring(0, 40) + (content.length > 40 ? '...' : '');
    }

    await chat.save();


    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullAssistantResponse = "";

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
        const formattedMessages = await Promise.all(chat.messages.map(async (msg) => {
            const parts = [{ text: msg.content }];
            // console.log(msg);
            if (msg.imageUrl) {
                /// console.log("Fetching history image from:", msg.imageUrl);
                try {
                    const response = await axios.get(msg.imageUrl, { responseType: 'arraybuffer' });
                    // console.log("Axios response received for history image", response);
                    const base64Image = Buffer.from(response.data).toString('base64');
                    // console.log("Base64 conversion complete for history image. Length:", base64Image);
                    const mimeType = response.headers['content-type'] || 'image/jpeg';
                    parts.push({
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType
                        }
                    });
                    // console.log(parts)
                } catch (err) {
                    console.error("Error fetching history image for Gemini:", err.message);
                }
            }
            return {
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: parts
            };
        }));

        // console.log("Formatted messages:", formattedMessages);

        formattedMessages.pop();
        const chatSession = model.startChat({ history: formattedMessages });

        // Final message parts including the current image if any
        const currentParts = [{ text: content }];
        if (imageUrl) {
            //  console.log("Fetching current image from:", imageUrl);
            try {
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                //  console.log("Axios response received for current image", response);
                const base64Image = Buffer.from(response.data).toString('base64');
                //  console.log("Base64 conversion complete for current image. Length:", base64Image);
                const mimeType = response.headers['content-type'] || 'image/jpeg';
                currentParts.push({
                    inlineData: {
                        data: base64Image,
                        mimeType: mimeType
                    }
                });
            } catch (err) {
                console.error("Error fetching current image for Gemini:", err.message);
            }
        }

        const result = await chatSession.sendMessageStream(currentParts);

        let lineBuffer = "";
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
                fullAssistantResponse += chunkText;
                lineBuffer += chunkText;
                
                const lines = lineBuffer.split('\n');
                // Keep the last partial line in the buffer
                lineBuffer = lines.pop();
                
                for (const line of lines) {
                    res.write(`data: ${JSON.stringify({ text: line + '\n' })}\n\n`);
                    await delay(50);
                }
            }
        }
        if (lineBuffer) {
            res.write(`data: ${JSON.stringify({ text: lineBuffer })}\n\n`);
        }
        //  console.log(fullAssistantResponse)

        const assistantMessage = new Message({ chatId, role: 'assistant', content: fullAssistantResponse });
        await assistantMessage.save();
        // console.log(assistantMessage)

        chat.messages.push({ messageId: assistantMessage._id, role: 'assistant', content: fullAssistantResponse });
        await chat.save();
        // console.log(chat)

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
    const chat = await Chat.findById(chatId);
    if (!chat)
        return res.status(404).json({ message: 'Chat not found' });
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.status(200).json({ messages });
});


export default {
    sendMessage,
    getMessagesByChat,
    uploadImage
};