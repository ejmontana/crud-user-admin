import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login',  userController.login);

// Protected routes
router.get('/alluser', authenticateToken, requireAdmin, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);
router.post('/register', authenticateToken, requireAdmin, userController.register);



export default router;