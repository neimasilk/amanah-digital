"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbackLastMigration = exports.runMigrations = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("../config/database");
const logger_1 = require("../utils/logger");
const createMigrationsTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    await (0, database_1.query)(createTableQuery);
    logger_1.logger.info('Migrations table created or already exists');
};
const getExecutedMigrations = async () => {
    const result = await (0, database_1.query)('SELECT filename FROM migrations ORDER BY id');
    return result.rows.map((row) => row.filename);
};
const recordMigration = async (filename) => {
    await (0, database_1.query)('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
};
const getMigrationFiles = () => {
    const migrationsDir = path_1.default.join(__dirname, 'migrations');
    if (!fs_1.default.existsSync(migrationsDir)) {
        logger_1.logger.warn('Migrations directory does not exist');
        return [];
    }
    return fs_1.default.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();
};
const executeMigration = async (filename) => {
    const migrationPath = path_1.default.join(__dirname, 'migrations', filename);
    const migrationSQL = fs_1.default.readFileSync(migrationPath, 'utf8');
    try {
        await (0, database_1.query)(migrationSQL);
        await recordMigration(filename);
        logger_1.logger.info(`Migration executed successfully: ${filename}`);
    }
    catch (error) {
        logger_1.logger.error(`Failed to execute migration ${filename}:`, error);
        throw error;
    }
};
const runMigrations = async () => {
    try {
        logger_1.logger.info('Starting database migrations...');
        await createMigrationsTable();
        const executedMigrations = await getExecutedMigrations();
        logger_1.logger.info(`Found ${executedMigrations.length} executed migrations`);
        const migrationFiles = getMigrationFiles();
        logger_1.logger.info(`Found ${migrationFiles.length} migration files`);
        const pendingMigrations = migrationFiles.filter(file => !executedMigrations.includes(file));
        if (pendingMigrations.length === 0) {
            logger_1.logger.info('No pending migrations');
            return;
        }
        logger_1.logger.info(`Found ${pendingMigrations.length} pending migrations`);
        for (const migration of pendingMigrations) {
            await executeMigration(migration);
        }
        logger_1.logger.info('All migrations completed successfully');
    }
    catch (error) {
        logger_1.logger.error('Migration failed:', error);
        throw error;
    }
};
exports.runMigrations = runMigrations;
const rollbackLastMigration = async () => {
    try {
        const result = await (0, database_1.query)('SELECT filename FROM migrations ORDER BY id DESC LIMIT 1');
        if (result.rows.length === 0) {
            logger_1.logger.info('No migrations to rollback');
            return;
        }
        const lastMigration = result.rows[0].filename;
        await (0, database_1.query)('DELETE FROM migrations WHERE filename = $1', [lastMigration]);
        logger_1.logger.warn(`Rolled back migration: ${lastMigration}`);
        logger_1.logger.warn('Note: This only removes the migration record. Manual cleanup may be required.');
    }
    catch (error) {
        logger_1.logger.error('Rollback failed:', error);
        throw error;
    }
};
exports.rollbackLastMigration = rollbackLastMigration;
if (require.main === module) {
    const command = process.argv[2];
    switch (command) {
        case 'up':
            (0, exports.runMigrations)()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        case 'rollback':
            (0, exports.rollbackLastMigration)()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;
        default:
            console.log('Usage: ts-node migrate.ts [up|rollback]');
            process.exit(1);
    }
}
//# sourceMappingURL=migrate.js.map