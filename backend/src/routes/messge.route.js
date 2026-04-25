import express from 'express';
import messageController from '../controllers/message.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../configs/cloudinary.js';
const {
    sendMessage,
    getMessagesByChat,
} = messageController;

const router = express.Router();


router.post('/send/:chatId', authMiddleware, upload.single('image'), sendMessage);
router.get('/chat/:chatId', authMiddleware, getMessagesByChat);

export default router;