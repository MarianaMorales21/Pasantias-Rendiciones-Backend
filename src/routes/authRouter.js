import { Router } from 'express';
import { login, logout, profile, forgotPassword, forgotPasswordByCedula, resetPassword, changePassword } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', verifyToken, profile);

// Rutas Públicas de recuperación
router.post('/forgot-password', forgotPassword);
router.post('/forgot-password-by-cedula', forgotPasswordByCedula);
router.post('/reset-password/:token', resetPassword);

// Cambio de contraseña (requiere sesión)
router.post('/change-password', verifyToken, changePassword);

export default router;
