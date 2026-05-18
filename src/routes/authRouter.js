import { Router } from 'express';
import { login, logout, profile, forgotPassword, resetPassword } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', verifyToken, profile);

// Rutas Públicas de recuperación
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
