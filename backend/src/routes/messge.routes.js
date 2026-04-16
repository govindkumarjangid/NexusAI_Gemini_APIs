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

// send message
router.post('/send', sendMessage);
// get all messages for a chat
router.get('/chat/:chatId', getMessagesByChat);
// get message by id
router.get('/:messageId', getMessageById);
// delete message by id
router.delete('/:messageId', deleteMessageById);
// edit message by id
router.put('/:messageId', editMessageById);
// get all messages for a user
router.get('/user/:userId', getMessagesByUser);

export default router;