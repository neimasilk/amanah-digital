"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.getMe = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const errorHandler_1 = require("../middleware/errorHandler");
const database_1 = require("../config/database");
const logger_1 = require("../utils/logger");
const email_1 = require("../utils/email");
const generateToken = (id) => {
    const options = {
        expiresIn: (process.env['JWT_EXPIRE'] || '24h'),
    };
    return jsonwebtoken_1.default.sign({ id }, process.env['JWT_SECRET'], options);
};
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user.id);
    const options = {
        expires: new Date(Date.now() + (parseInt(process.env['JWT_COOKIE_EXPIRE']) || 24) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
    };
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
        success: true,
        token,
        data: {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                isVerified: user.is_verified,
            },
        },
    });
};
exports.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await (0, database_1.query)('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        return res.status(400).json({
            success: false,
            error: { message: 'User already exists with this email' }
        });
    }
    const salt = await bcryptjs_1.default.genSalt(12);
    const passwordHash = await bcryptjs_1.default.hash(password, salt);
    const result = await (0, database_1.query)(`INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, email, first_name, last_name, role, is_verified, created_at`, [email, passwordHash, firstName, lastName, 'user', false]);
    const user = result.rows[0];
    logger_1.logger.info(`New user registered: ${email}`);
    return sendTokenResponse(user, 201, res);
});
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const result = await (0, database_1.query)('SELECT id, email, password_hash, first_name, last_name, role, is_verified FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
        return res.status(401).json({
            success: false,
            error: { message: 'Invalid credentials' }
        });
    }
    const user = result.rows[0];
    const isMatch = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            error: { message: 'Invalid credentials' }
        });
    }
    logger_1.logger.info(`User logged in: ${email}`);
    return sendTokenResponse(user, 200, res);
});
exports.logout = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    return res.status(200).json({
        success: true,
        data: { message: 'User logged out successfully' },
    });
});
exports.getMe = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, database_1.query)('SELECT id, email, first_name, last_name, role, is_verified, created_at FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    return res.status(200).json({
        success: true,
        data: {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                isVerified: user.is_verified,
                createdAt: user.created_at,
            },
        },
    });
});
exports.forgotPassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const result = await (0, database_1.query)('SELECT id, email FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
        return res.status(404).json({
            success: false,
            error: { message: 'User not found' }
        });
    }
    const resetToken = crypto_1.default.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await (0, database_1.query)('UPDATE users SET reset_password_token = $1, reset_password_expire = $2 WHERE email = $3', [resetPasswordToken, resetPasswordExpire, email]);
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    try {
        await (0, email_1.sendEmail)({
            email,
            subject: 'Password reset token',
            message,
        });
        return res.status(200).json({
            success: true,
            data: { message: 'Email sent' },
        });
    }
    catch (err) {
        logger_1.logger.error('Email could not be sent:', err);
        await (0, database_1.query)('UPDATE users SET reset_password_token = NULL, reset_password_expire = NULL WHERE email = $1', [email]);
        return res.status(500).json({
            success: false,
            error: { message: 'Email could not be sent' }
        });
    }
});
exports.resetPassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { token, password } = req.body;
    const resetPasswordToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const result = await (0, database_1.query)('SELECT id, email FROM users WHERE reset_password_token = $1 AND reset_password_expire > $2', [resetPasswordToken, new Date()]);
    if (result.rows.length === 0) {
        return res.status(400).json({
            success: false,
            error: { message: 'Invalid or expired token' }
        });
    }
    const user = result.rows[0];
    const salt = await bcryptjs_1.default.genSalt(12);
    const passwordHash = await bcryptjs_1.default.hash(password, salt);
    await (0, database_1.query)('UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expire = NULL WHERE id = $2', [passwordHash, user.id]);
    logger_1.logger.info(`Password reset for user: ${user.email}`);
    return sendTokenResponse(user, 200, res);
});
exports.updatePassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await (0, database_1.query)('SELECT id, email, password_hash, first_name, last_name, role, is_verified FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password_hash);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            error: { message: 'Current password is incorrect' }
        });
    }
    const salt = await bcryptjs_1.default.genSalt(12);
    const passwordHash = await bcryptjs_1.default.hash(newPassword, salt);
    await (0, database_1.query)('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, user.id]);
    logger_1.logger.info(`Password updated for user: ${user.email}`);
    return sendTokenResponse(user, 200, res);
});
//# sourceMappingURL=auth.js.map