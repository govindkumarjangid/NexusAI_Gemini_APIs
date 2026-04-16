import express from 'express';

import {
    createChat,
    getChatsByUser,
    addMessageToChat,
    updateChatWithMessage,
    deleteChat
} from '../controllers/chat.controller.js';

const router = express.Router();

// create new chat
router.post('/create', createChat);
// get all chats for a user
router.get('/user/:userId', getChatsByUser);
// add message to chat
router.post('/:chatId/message', addMessageToChat);
// update chat with new message
router.put('/:chatId/message', updateChatWithMessage);
// delete chat by id
router.delete('/:chatId', deleteChat);



export default router;