import { userModel } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { createAccesToken } from '../token.js';
import { sendRecoveryEmail, sendPasswordToEmail } from '../libs/nodemailer.js';

export const login = async (req, res) => {
    const { ced_usu, cla_usu } = req.body;
    const trimmedCedula = ced_usu ? String(ced_usu).trim() : "";

    try {
        const userFound = await userModel.getUserModel({ ced_usu: trimmedCedula });
        
        if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

        let isMatch = await bcrypt.compare(cla_usu, userFound.cla_usu);
        
        // Fallback: Si no coincide con bcrypt, verificar si es texto plano (Legacy support)
        if (!isMatch && cla_usu === userFound.cla_usu) {
            isMatch = true;
            // Opcional: Hashear y actualizar la contraseña en la DB para el futuro
            try {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(cla_usu, salt);
                await userModel.updatePasswordModel(userFound.ced_usu, hashedPassword);
                console.log(`Contraseña de usuario ${userFound.ced_usu} actualizada a hash exitosamente.`);
            } catch (updateError) {
                console.error("Error al actualizar contraseña legacy:", updateError);
                // No detenemos el login si falla la actualización, ya que la contraseña fue correcta
            }
        }

        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

        // Bloquear inicio de sesión si el usuario está suspendido o inactivo
        if (userFound.nom_sta === 'Suspendido' || userFound.nom_sta === 'Inactivo') {
            return res.status(403).json({
                message: "Usuario suspendido. Contacte al administrador.",
                suspended: true
            });
        }

        const token = await createAccesToken({ 
            id: userFound.ced_usu, 
            rol: userFound.rol_usu,
            nombre: userFound.nom_usu 
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        res.json({
            ced_usu: userFound.ced_usu,
            nom_usu: userFound.nom_usu,
            rol_usu: userFound.rol_usu,
            rol_nom: userFound.rol_nom,
            ema_usu: userFound.ema_usu,
            sta_usu: userFound.sta_usu,
            nom_sta: userFound.nom_sta
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const logout = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};

export const profile = async (req, res) => {
    try {
        const userFound = await userModel.getUserModel({ ced_usu: req.user.id });
        // Si el usuario fue eliminado o no existe, cerrar sesión
        if (!userFound) {
            res.cookie('token', '', { expires: new Date(0) });
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        // Si el usuario está suspendido o inactivo, cerrar sesión
        if (userFound.nom_sta === 'Suspendido' || userFound.nom_sta === 'Inactivo') {
            res.cookie('token', '', { expires: new Date(0) });
            return res.status(401).json({ message: "Usuario suspendido. Contacte al administrador." });
        }

        return res.json({
            ced_usu: userFound.ced_usu,
            nom_usu: userFound.nom_usu,
            rol_usu: userFound.rol_usu,
            rol_nom: userFound.rol_nom,
            ema_usu: userFound.ema_usu,
            sta_usu: userFound.sta_usu,
            nom_sta: userFound.nom_sta
        });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener perfil" });
    }
};

// --- RECUPERACIÓN DE CONTRASEÑA ---

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.getUserByEmailModel(email);
        if (!user) {
            return res.status(200).json({ message: "Si el correo existe en nuestro sistema, recibirás un enlace de recuperación." });
        }

        // Crear token temporal (15 minutos)
        const token = jwt.sign({ id: user.ced_usu }, process.env.PALABRASECRETA || 'secret123', { expiresIn: '15m' });

        await sendRecoveryEmail(user.ema_usu, token);

        res.json({ message: "Correo de recuperación enviado exitosamente." });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Error al enviar el correo de recuperación." });
    }
};

export const forgotPasswordByCedula = async (req, res) => {
    const { ced_usu } = req.body;

    try {
        const user = await userModel.getUserModel({ ced_usu: String(ced_usu).trim() });
        if (!user) {
            return res.status(404).json({ message: "No se encontró un usuario con esa cédula." });
        }

        if (!user.ema_usu) {
            return res.status(400).json({ message: "El usuario no tiene un correo electrónico registrado." });
        }

        // Generar contraseña temporal de 8 caracteres
        const tempPassword = crypto.randomBytes(4).toString('hex');

        // Hashear y guardar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);
        await userModel.updatePasswordModel(user.ced_usu, hashedPassword);

        // Enviar la contraseña temporal al correo
        try {
            await sendPasswordToEmail(user.ema_usu, tempPassword, user.nom_usu);
            console.log(`Correo enviado exitosamente a ${user.ema_usu}`);
        } catch (emailError) {
            console.error("Error al enviar correo:", emailError);
        }

        res.json({ message: "Se ha enviado una nueva contraseña a tu correo electrónico." });
    } catch (error) {
        console.error("Forgot Password By Cedula Error:", error);
        res.status(500).json({ message: "Error al enviar la nueva contraseña." });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: "La nueva contraseña es obligatoria." });

    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.PALABRASECRETA || 'secret123');
        const userId = decoded.id;

        // Hashear nueva clave
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Actualizar en DB
        await userModel.updatePasswordModel(userId, hashedPassword);

        res.json({ message: "Contraseña actualizada correctamente. Ya puedes iniciar sesión." });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "El enlace ha expirado. Por favor solicita uno nuevo." });
        }
        res.status(400).json({ message: "Enlace de recuperación inválido o expirado." });
    }
};

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Ambas contraseñas son obligatorias." });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres." });
    }

    try {
        const user = await userModel.getUserModel({ ced_usu: userId });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.cla_usu);
        if (!isMatch) {
            return res.status(400).json({ message: "La contraseña actual no es correcta." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await userModel.updatePasswordModel(userId, hashedPassword);

        res.json({ message: "Contraseña actualizada correctamente." });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: "Error al cambiar la contraseña." });
    }
};
