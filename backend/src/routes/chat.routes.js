import express from 'express';

import {
    createChat,
    getChatsByUser,
    addMessageToChat,
    deleteChat
} from '../controllers/chat.controller.js';

const router = express.Router();


router.post('/create', createChat);

router.get('/user-chats/:userId', getChatsByUser);

router.post('/:chatId/message', addMessageToChat);

router.delete('/:chatId', deleteChat);



export default router;