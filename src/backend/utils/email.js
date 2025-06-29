"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("./logger");
const createTransporter = () => {
    if (process.env['NODE_ENV'] === 'development') {
        return nodemailer_1.default.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env['SMTP_EMAIL'] || 'ethereal.user@ethereal.email',
                pass: process.env['SMTP_PASSWORD'] || 'ethereal.pass'
            }
        });
    }
    return nodemailer_1.default.createTransport({
        host: process.env['SMTP_HOST'],
        port: parseInt(process.env['SMTP_PORT'] || '587'),
        secure: process.env['SMTP_PORT'] === '465',
        auth: {
            user: process.env['SMTP_EMAIL'],
            pass: process.env['SMTP_PASSWORD'],
        },
    });
};
const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();
        const message = {
            from: `${process.env['FROM_NAME'] || 'Amanah Digital'} <${process.env['FROM_EMAIL'] || 'noreply@amanahdigital.com'}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html || options.message.replace(/\n/g, '<br>'),
        };
        const info = await transporter.sendMail(message);
        logger_1.logger.info(`Email sent to ${options.email}: ${info.messageId}`);
        if (process.env['NODE_ENV'] === 'development') {
            logger_1.logger.info(`Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        }
    }
    catch (error) {
        logger_1.logger.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};
exports.sendEmail = sendEmail;
exports.emailTemplates = {
    welcome: (firstName) => ({
        subject: 'Welcome to Amanah Digital',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5aa0;">Welcome to Amanah Digital, ${firstName}!</h2>
        <p>Thank you for joining our platform for digital inheritance planning.</p>
        <p>You can now start planning your digital legacy and ensuring your assets are properly managed.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Next Steps:</h3>
          <ul>
            <li>Complete your profile setup</li>
            <li>Add your digital assets to the vault</li>
            <li>Set up your inheritance plan</li>
          </ul>
        </div>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>The Amanah Digital Team</p>
      </div>
    `
    }),
    passwordReset: (resetUrl, firstName) => ({
        subject: 'Password Reset Request - Amanah Digital',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5aa0;">Password Reset Request</h2>
        <p>Hello ${firstName},</p>
        <p>You have requested to reset your password for your Amanah Digital account.</p>
        <p>Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2c5aa0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in 10 minutes for security reasons.</p>
        <p>If you did not request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The Amanah Digital Team</p>
      </div>
    `
    })
};
//# sourceMappingURL=email.js.map