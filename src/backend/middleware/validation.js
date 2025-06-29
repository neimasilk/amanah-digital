"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = require("../utils/logger");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg,
            value: error.type === 'field' ? error.value : undefined
        }));
        logger_1.logger.warn('Validation failed:', {
            url: req.originalUrl,
            method: req.method,
            errors: errorMessages,
            ip: req.ip
        });
        res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                details: errorMessages
            }
        });
        return;
    }
    next();
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validation.js.map