import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Si lo deseas protegido: agrega authenticateToken
router.post('/asistente', authenticateToken, chatController.chat);

export default router;