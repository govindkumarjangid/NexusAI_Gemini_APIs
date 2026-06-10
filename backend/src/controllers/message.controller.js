import Message from '../models/message.model.js';
import Chat from '../models/chat.model.js';
import wrapAsync from '../utils/wrapAsync.js';
import genAI from '../configs/genAI.js';
import axios from 'axios';
import { cloudinary } from '../configs/cloudinary.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const TEXT_MODEL = "gemini-3.5-flash";
const IMAGE_ONLY_PROMPT = "Please respond to the uploaded image.";
const DEFAULT_ASSISTANT_ERROR_MESSAGE = "Sorry, I couldn't generate a response right now. Please try again in a moment.";

const getCleanText = (value) => (typeof value === 'string' ? value.trim() : '');

const writeSse = (res, payload) => {
    if (res.writable && !res.writableEnded) {
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
    }
};

const streamTextToClient = async (res, text) => {
    const lines = text.split('\n');

    for (let index = 0; index < lines.length; index++) {
        if (!res.writable || res.writableEnded) {
            break;
        }
        const isLastLine = index === lines.length - 1;
        const textChunk = isLastLine ? lines[index] : `${lines[index]}\n`;

        if (textChunk) {
            writeSse(res, { text: textChunk });
            await delay(20);
        }
    }
};

const fetchImagePart = async (imageUrl) => {
    const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 15000
    });
    const mimeType = response.headers['content-type'] || 'image/jpeg';

    if (!mimeType.startsWith('image/'))
        throw new Error('Uploaded file is not a supported image');

    return {
        inlineData: {
            data: Buffer.from(response.data).toString('base64'),
            mimeType
        }
    };
};

const buildGeminiParts = async ({ content, imageUrl, includeImage = false, fallbackText = '', failOnImageError = false }) => {
    const parts = [];
    const text = getCleanText(content);

    if (text) parts.push({ text });
    else if (fallbackText) parts.push({ text: fallbackText });

    if (includeImage && imageUrl) {
        try {
            parts.push(await fetchImagePart(imageUrl));
        } catch (error) {
            if (failOnImageError) throw error;
            console.error("Skipping history image for Gemini:", error.message);
        }
    }

    return parts;
};

const appendGeminiContent = (contents, nextContent) => {
    if (!nextContent.parts.length) return;
    const lastContent = contents[contents.length - 1];

    if (lastContent?.role === nextContent.role) {
        lastContent.parts.push(...nextContent.parts);
        return;
    }

    contents.push(nextContent);
};

const buildGeminiHistory = async (messages) => {
    const history = [];

    for (const msg of messages) {
        const role = msg.role === 'assistant' ? 'model' : 'user';
        const parts = await buildGeminiParts({
            content: msg.content,
            imageUrl: msg.imageUrl,
            includeImage: msg.role === 'user' && Boolean(msg.imageUrl),
            fallbackText: msg.role === 'user' && msg.imageUrl ? IMAGE_ONLY_PROMPT : ''
        });

        if (!history.length && role !== 'user') continue;
        appendGeminiContent(history, { role, parts });
    }

    return history;
};

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
    const textContent = getCleanText(content);

    if (!textContent && !imageUrl)
        return res.status(400).json({ message: 'Message content or image is required' });

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    if (chat.userId && req.user?._id && chat.userId.toString() !== req.user._id.toString())
        return res.status(403).json({ message: 'You do not have access to this chat' });

    const newMessage = new Message({ chatId, role: 'user', content: textContent, imageUrl: imageUrl || '' });
    await newMessage.save();

    chat.messages.push(newMessage._id);

    // Auto-update title if it's still "New Chat"
    if (chat.title === 'New Chat') {
        if (textContent)
            chat.title = textContent.substring(0, 40) + (textContent.length > 40 ? '...' : '');
        else if (imageUrl)
            chat.title = 'Image Message';
    }

    await chat.save();

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    let fullAssistantResponse = "";

    try {
        const model = genAI.getGenerativeModel({ model: TEXT_MODEL });
        const historyMessages = await Message.find({
            chatId,
            _id: { $ne: newMessage._id }
        }).sort({ createdAt: 1 });

        const formattedMessages = await buildGeminiHistory(historyMessages);

        // Final message parts including the current image if any
        const currentParts = await buildGeminiParts({
            content: textContent,
            imageUrl,
            includeImage: Boolean(imageUrl),
            fallbackText: imageUrl ? IMAGE_ONLY_PROMPT : '',
            failOnImageError: true
        });

        const lastHistoryMessage = formattedMessages[formattedMessages.length - 1];
        if (lastHistoryMessage?.role === 'user')
            currentParts.unshift(...formattedMessages.pop().parts);

        const result = await model.generateContent({
            contents: [
                ...formattedMessages,
                { role: 'user', parts: currentParts }
            ]
        });

        fullAssistantResponse = result.response.text();

        if (!fullAssistantResponse.trim())
            throw new Error('AI returned an empty response');

        await streamTextToClient(res, fullAssistantResponse);

        const assistantMessage = new Message({ chatId, role: 'assistant', content: fullAssistantResponse });
        await assistantMessage.save();

        chat.messages.push(assistantMessage._id);
        await chat.save();

        if (res.writable && !res.writableEnded) {
            writeSse(res, { done: true, message: assistantMessage });
            res.end();
        }
    } catch (error) {
        console.error("Stream Error:", error);

        try {
            const fallbackMessage = new Message({
                chatId,
                role: 'assistant',
                content: DEFAULT_ASSISTANT_ERROR_MESSAGE
            });
            await fallbackMessage.save();

            chat.messages.push(fallbackMessage._id);
            await chat.save();

            if (res.writable && !res.writableEnded) {
                await streamTextToClient(res, DEFAULT_ASSISTANT_ERROR_MESSAGE);
                writeSse(res, { done: true, message: fallbackMessage, fallback: true });
                res.end();
            }
        } catch (innerError) {
            console.error("Error in Stream Error Fallback Handling:", innerError);
            if (res.writable && !res.writableEnded) {
                try {
                    res.end();
                } catch (e) {
                    console.error("Failed to force close response:", e.message);
                }
            }
        }
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


// generate image using nano-banana-pro-preview
const generateImage = wrapAsync(async (req, res) => {
    const { chatId } = req.params;
    const { prompt } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Save user message (the prompt)
    const userMsg = new Message({ chatId, role: 'user', content: `Generate image: ${prompt}` });
    await userMsg.save();
    chat.messages.push(userMsg._id);

    if (chat.title === 'New Chat')
        chat.title = prompt.substring(0, 40) + (prompt.length > 40 ? '...' : '');

    await chat.save();

    try {
        // Enhance the prompt using a text model
        const textModel = genAI.getGenerativeModel({ model: "gemini-3.1-flash-image-preview" });
        const enhancementPrompt = `You are an expert prompt engineer for AI image generators.
        Your task is to take a simple user prompt and expand it into a detailed, high-quality, artistic prompt for an image generator.
        Add details about lighting, style, composition, texture, and mood, but keep the core subject exactly as the user requested.
        Focus on creating a visually stunning result.

        User prompt: "${prompt}"

        Detailed artistic prompt:`;

        const textResult = await textModel.generateContent(enhancementPrompt);
        const enhancedPrompt = textResult.response.text().trim();
        // console.log("Original prompt:", prompt);
        // console.log("Enhanced prompt:", enhancedPrompt);

        const model = genAI.getGenerativeModel({ model: "gemma-3-12b-it" });
        const result = await model.generateContent(enhancedPrompt);
        const response = await result.response;

        let imageUrl = "";
        const parts = response.candidates[0].content.parts;
        const imagePart = parts.find(p => p.inlineData);

        if (imagePart) {
            const base64Data = imagePart.inlineData.data;
            const mimeType = imagePart.inlineData.mimeType;
            // Upload to Cloudinary
            const uploadRes = await cloudinary.uploader.upload(`data:${mimeType};base64,${base64Data}`, {
                folder: 'NexusAi_Generated',
            });
            imageUrl = uploadRes.secure_url;
        } else {
            return res.status(500).json({ success: false, message: 'Model did not return an image. It might be a text-only response.' });
        }

        const assistantMsg = new Message({
            chatId,
            role: 'assistant',
            content: `Generated image for: ${prompt}`,
            imageUrl: imageUrl
        });
        await assistantMsg.save();
        chat.messages.push(assistantMsg._id);
        await chat.save();

        res.status(200).json({ success: true, imageUrl });
    } catch (error) {
        console.error("Image Gen Error:", error);
        res.status(500).json({ success: false, message: error.message || 'Failed to generate image' });
    }
});

export default {
    sendMessage,
    getMessagesByChat,
    uploadImage,
    generateImage
};
