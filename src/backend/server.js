"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const auth_1 = __importDefault(require("./routes/auth"));
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
const migrate_1 = require("./database/migrate");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env['PORT'] || 5000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
    credentials: true
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined', { stream: { write: (message) => logger_1.logger.info(message.trim()) } }));
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.use('/api/auth', auth_1.default);
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        logger_1.logger.info('Database connected successfully');
        await (0, migrate_1.runMigrations)();
        logger_1.logger.info('Database migrations completed');
        app.listen(PORT, () => {
            logger_1.logger.info(`Server running on port ${PORT}`);
            logger_1.logger.info(`Environment: ${process.env['NODE_ENV'] || 'development'}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
if (process.env['NODE_ENV'] !== 'test') {
    startServer();
}
exports.default = app;
//# sourceMappingURL=server.js.map