"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, _req, res, _next) => {
    let error = { ...err };
    error.message = err.message;
    logger_1.logger.error(`Error ${err.statusCode || 500}: ${err.message}`);
    logger_1.logger.error(err.stack);
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { ...error, message, statusCode: 404 };
    }
    if (err.name === 'MongoError' && err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { ...error, message, statusCode: 400 };
    }
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        error = { ...error, message, statusCode: 400 };
    }
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { ...error, message, statusCode: 401 };
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { ...error, message, statusCode: 401 };
    }
    if (err.name === 'QueryFailedError') {
        const message = 'Database query failed';
        error = { ...error, message, statusCode: 500 };
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: {
            message: error.message || 'Server Error',
            ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack })
        }
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map