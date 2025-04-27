const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración con Ethereal para pruebas (no envía emails reales pero es perfecto para desarrollo)
const crearTransportador = async () => {
    // Crear una cuenta de prueba de Ethereal
    const testAccount = await nodemailer.createTestAccount();
    
    // Crear un transportador reutilizable usando SMTP de Ethereal
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_APP_PASSWORD, 
        },
    });
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: process.env.EMAIL_USER, 
    //         pass: process.env.EMAIL_APP_PASSWORD, 
    //     },
    // });
    
    return { transporter, testAccount };
};

// Función para enviar correo de recuperación
const enviarCorreo = async (email_usu, nuevaPassword) => {
    try {
        console.log("Enviando correo de recuperación a:", email_usu);
        
        // Crear transportador con cuenta de prueba
        const { transporter, testAccount } = await crearTransportador();
        
        // Enviar correo
        const info = await transporter.sendMail({
            from: '"DigiAgro Recuperación de Password" <test@example.com>',
            to: email_usu,
            subject: "Recuperación de contraseña - DigiAgro",
            text: `Tu nueva contraseña temporal es: ${nuevaPassword}\n\nPor seguridad, te recomendamos cambiarla lo antes posible al iniciar sesión.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #4CAF50; border-radius: 5px;">
                    <h2 style="color: #4CAF50; text-align: center;">Recuperación de Contraseña</h2>
                    <p>Hola,</p>
                    <p>Has solicitado recuperar tu contraseña para acceder a DigiAgro.</p>
                    <p>Tu nueva contraseña temporal es:</p>
                    <div style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 18px; font-weight: bold; margin: 15px 0;">
                        ${nuevaPassword}
                    </div>
                    <p>Por razones de seguridad, te recomendamos que cambies esta contraseña lo antes posible después de iniciar sesión.</p>
                    <p>Si no has solicitado este cambio de contraseña, por favor contacta con el administrador del sistema.</p>
                    <p style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px; font-size: 12px; color: #777; text-align: center;">
                        Este es un mensaje automático, por favor no respondas a este correo.
                    </p>
                </div>
            `
        });

        console.log("Correo enviado exitosamente, ID:", info.messageId);
        
        // En desarrollo, muestra un enlace de vista previa 
        console.log("URL para ver el correo enviado: %s", nodemailer.getTestMessageUrl(info));
        
        return {
            success: true,
            messageId: info.messageId,
            previewUrl: nodemailer.getTestMessageUrl(info)
        };
    } catch (error) {
        console.error("Error enviando el correo:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = enviarCorreo;
