import { Router } from 'express';
import { productoController } from '../controllers/productoController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Protected routes
router.post('/', authenticateToken, requireAdmin, upload.single('Imagen'), productoController.createProducto);
router.get('/', authenticateToken, productoController.getAllProductos);
router.get('/:id', authenticateToken, productoController.getProductoById);
router.put('/:id', authenticateToken, requireAdmin, upload.single('Imagen'), productoController.updateProducto);
router.delete('/:id', authenticateToken, requireAdmin, productoController.deleteProducto);

export default router;