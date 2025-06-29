import fs from 'fs';
import path from 'path';
import { query } from '../config/database';
import { logger } from '../utils/logger';

interface Migration {
  id: number;
  filename: string;
  executed_at: Date;
}

// Create migrations table if it doesn't exist
const createMigrationsTable = async (): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await query(createTableQuery);
  logger.info('Migrations table created or already exists');
};

// Get executed migrations
const getExecutedMigrations = async (): Promise<string[]> => {
  const result = await query('SELECT filename FROM migrations ORDER BY id');
  return result.rows.map((row: Migration) => row.filename);
};

// Record migration as executed
const recordMigration = async (filename: string): Promise<void> => {
  await query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
};

// Get all migration files
const getMigrationFiles = (): string[] => {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    logger.warn('Migrations directory does not exist');
    return [];
  }
  
  return fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
};

// Execute a single migration
const executeMigration = async (filename: string): Promise<void> => {
  const migrationPath = path.join(__dirname, 'migrations', filename);
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  try {
    // Execute the migration SQL
    await query(migrationSQL);
    
    // Record the migration as executed
    await recordMigration(filename);
    
    logger.info(`Migration executed successfully: ${filename}`);
  } catch (error) {
    logger.error(`Failed to execute migration ${filename}:`, error);
    throw error;
  }
};

// Run all pending migrations
export const runMigrations = async (): Promise<void> => {
  try {
    logger.info('Starting database migrations...');
    
    // Create migrations table
    await createMigrationsTable();
    
    // Get executed migrations
    const executedMigrations = await getExecutedMigrations();
    logger.info(`Found ${executedMigrations.length} executed migrations`);
    
    // Get all migration files
    const migrationFiles = getMigrationFiles();
    logger.info(`Found ${migrationFiles.length} migration files`);
    
    // Find pending migrations
    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.includes(file)
    );
    
    if (pendingMigrations.length === 0) {
      logger.info('No pending migrations');
      return;
    }
    
    logger.info(`Found ${pendingMigrations.length} pending migrations`);
    
    // Execute pending migrations
    for (const migration of pendingMigrations) {
      await executeMigration(migration);
    }
    
    logger.info('All migrations completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
};

// Rollback last migration (basic implementation)
export const rollbackLastMigration = async (): Promise<void> => {
  try {
    const result = await query(
      'SELECT filename FROM migrations ORDER BY id DESC LIMIT 1'
    );
    
    if (result.rows.length === 0) {
      logger.info('No migrations to rollback');
      return;
    }
    
    const lastMigration = result.rows[0].filename;
    
    // Remove from migrations table
    await query('DELETE FROM migrations WHERE filename = $1', [lastMigration]);
    
    logger.warn(`Rolled back migration: ${lastMigration}`);
    logger.warn('Note: This only removes the migration record. Manual cleanup may be required.');
  } catch (error) {
    logger.error('Rollback failed:', error);
    throw error;
  }
};

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'up':
      runMigrations()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
    case 'rollback':
      rollbackLastMigration()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
    default:
      console.log('Usage: ts-node migrate.ts [up|rollback]');
      process.exit(1);
  }
}