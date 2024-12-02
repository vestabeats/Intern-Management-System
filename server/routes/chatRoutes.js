import express from 'express'
import { isAdminRoute, protectRoute,isSupRoute } from "../middleware/authMiddleware.js";
import { createChat, userChats } from '../controllers/chatController.js';
const router = express.Router()

router.post('/',protectRoute, createChat);
router.get('/:receiverId',protectRoute, userChats);
//router.get('/find/:firstId/:secondId',protectRoute, findChat);

export default router