"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const logger_1 = require("../utils/logger");
const notFound = (req, res, _next) => {
    const message = `Not found - ${req.originalUrl}`;
    logger_1.logger.warn(message);
    res.status(404).json({
        success: false,
        error: {
            message: 'Route not found',
            path: req.originalUrl,
            method: req.method
        }
    });
};
exports.notFound = notFound;
//# sourceMappingURL=notFound.js.map