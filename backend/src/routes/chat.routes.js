import express from 'express';

import {
    createChat,
    getChatsByUser,
    addMessageToChat,
    updateChatWithMessage,
    deleteChat
} from '../controllers/chat.controller.js';

const router = express.Router();


router.post('/create', createChat);

router.get('/user-chats/:userId', getChatsByUser);

router.post('/:chatId/message', addMessageToChat);

router.put('/:chatId/message', updateChatWithMessage);

router.delete('/:chatId', deleteChat);



export default router;