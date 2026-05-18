import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: process.env.SMTP_PORT || 2525,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Función auxiliar para enviar el correo de recuperación
export const sendRecoveryEmail = async (email, token) => {
    const recoveryLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
    
    const mailOptions = {
        from: '"Soporte Pasantías" <soporte@pasantias.com>',
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
