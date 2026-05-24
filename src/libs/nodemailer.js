import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const fromName = `"FUNDES - Recuperación" <${process.env.EMAIL || 'soporte@pasantias.com'}>`;

// Función auxiliar para enviar el correo de recuperación
export const sendRecoveryEmail = async (email, token) => {
    const recoveryLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
    
    const mailOptions = {
        from: fromName,
        to: email,
        subject: "Recuperación de Contraseña",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #2c3e50;">Recuperación de Contraseña</h2>
                <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${recoveryLink}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a>
                </div>
                <p>Este enlace expirará en 15 minutos.</p>
                <p style="color: #7f8c8d; font-size: 12px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
            </div>
        `
    };

    return await transporter.sendMail(mailOptions);
};

// Función para enviar la nueva contraseña generada
export const sendPasswordToEmail = async (email, password, nombre) => {
    const mailOptions = {
        from: fromName,
        to: email,
        subject: "Nueva Contraseña - FUNDES",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #2c3e50;">Nueva Contraseña</h2>
                <p>Hola <strong>${nombre || 'Usuario'}</strong>,</p>
                <p>Has solicitado una nueva contraseña. A continuación, tus credenciales actualizadas:</p>
                <div style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Nueva Contraseña:</strong></p>
                    <p style="font-size: 20px; font-weight: bold; color: #2c3e50; letter-spacing: 2px; text-align: center;">${password}</p>
                </div>
                <p>Puedes cambiar esta contraseña desde tu perfil una vez que inicies sesión.</p>
                <p style="color: #7f8c8d; font-size: 12px;">Si no solicitaste este cambio, contacta al administrador del sistema.</p>
            </div>
        `
    };

    return await transporter.sendMail(mailOptions);
};
