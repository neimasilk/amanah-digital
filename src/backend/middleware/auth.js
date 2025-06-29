"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const logger_1 = require("../utils/logger");
const database_1 = require("../config/database");
exports.protect = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies?.token) {
        token = req.cookies.token;
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            error: { message: 'Not authorized to access this route' }
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env['JWT_SECRET']);
        const result = await (0, database_1.query)('SELECT id, email, role, created_at FROM users WHERE id = $1', [decoded.id]);
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: { message: 'User not found' }
            });
        }
        req.user = result.rows[0];
        return next();
    }
    catch (error) {
        logger_1.logger.error('JWT verification failed:', error);
        return res.status(401).json({
            success: false,
            error: { message: 'Not authorized to access this route' }
        });
    }
});
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: { message: 'User not authenticated' }
            });
        }
        if (!roles.includes(req.user.role || 'user')) {
            return res.status(403).json({
                success: false,
                error: { message: 'User role not authorized to access this route' }
            });
        }
        return next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map