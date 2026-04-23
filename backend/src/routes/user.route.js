import express from 'express';
import { registerUser, loginUser, logoutUser, deleteAccount } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);
router.post('/delete', authMiddleware, deleteAccount);

export default router;