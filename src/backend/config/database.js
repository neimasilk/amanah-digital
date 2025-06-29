"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.connectDatabase = exports.pool = void 0;
const pg_1 = require("pg");
const logger_1 = require("../utils/logger");
const config = {
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432'),
    database: process.env['DB_NAME'] || 'amanah_digital',
    user: process.env['DB_USER'] || 'postgres',
    password: process.env['DB_PASSWORD'] || 'password',
    ssl: process.env['NODE_ENV'] === 'production'
};
exports.pool = new pg_1.Pool(config);
const connectDatabase = async () => {
    try {
        const client = await exports.pool.connect();
        const result = await client.query('SELECT NOW()');
        logger_1.logger.info(`Database connected at ${result.rows[0].now}`);
        client.release();
    }
    catch (error) {
        logger_1.logger.error('Database connection failed:', error);
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await exports.pool.query(text, params);
        const duration = Date.now() - start;
        logger_1.logger.debug(`Query executed in ${duration}ms: ${text}`);
        return result;
    }
    catch (error) {
        logger_1.logger.error('Query error:', error);
        throw error;
    }
};
exports.query = query;
process.on('SIGINT', async () => {
    logger_1.logger.info('Shutting down database connection...');
    await exports.pool.end();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    logger_1.logger.info('Shutting down database connection...');
    await exports.pool.end();
    process.exit(0);
});
//# sourceMappingURL=database.js.map