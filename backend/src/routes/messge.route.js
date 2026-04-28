import express from 'express';
import messageController from '../controllers/message.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../configs/cloudinary.js';
const {
    sendMessage,
    getMessagesByChat,
    uploadImage,
} = messageController;

const router = express.Router();


router.post('/upload', authMiddleware, upload.single('image'), uploadImage);
router.post('/send/:chatId', authMiddleware, sendMessage);
router.post('/generate-image/:chatId', authMiddleware, messageController.generateImage);
router.get('/chat/:chatId', authMiddleware, getMessagesByChat);

export default router;