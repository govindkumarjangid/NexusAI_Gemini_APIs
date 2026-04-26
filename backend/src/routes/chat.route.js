import express from 'express';
import {
    createChat,
    getChatsByUser,
    deleteChat,
    shareChat,
    getSharedChat
} from '../controllers/chat.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createChat);
router.get('/user-chats/:userId', authMiddleware, getChatsByUser);
router.delete('/:chatId', authMiddleware, deleteChat);
router.post('/share/:chatId', authMiddleware, shareChat);
router.get('/shared/:shareId', getSharedChat);



export default router;