import express from 'express';
import messageController from '../controllers/message.controller.js';
const {
    sendMessage,
    getMessagesByChat,
    getMessageById,
    deleteMessageById,
    editMessageById,
    getMessagesByUser
} = messageController;

const router = express.Router();


router.post('/send/:chatId', sendMessage);

router.get('/chat/:chatId', getMessagesByChat);

router.get('/:messageId', getMessageById);

router.delete('/:messageId', deleteMessageById);

router.put('/:messageId', editMessageById);

router.get('/user/:userId', getMessagesByUser);

export default router;