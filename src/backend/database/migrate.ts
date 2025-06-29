import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { query } from '../config/database';
import { logger } from '../utils/logger';

// Load environment variables from the backend .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });



interface Migration {
  id: number;
  filename: string;
  executed_at: Date;
}

// Create migrations table if it doesn't exist
const createMigrationsTable = async (): Promise<void> => {
  const USE_SQLITE = process.env['USE_SQLITE'] === 'true' || process.env['NODE_ENV'] === 'development';
  
  const createTableQuery = USE_SQLITE ? `
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT UNIQUE NOT NULL,
      executed_at TEXT DEFAULT (datetime('now'))
    );
  ` : `
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
  const USE_SQLITE = process.env['USE_SQLITE'] === 'true' || process.env['NODE_ENV'] === 'development';
  const insertQuery = USE_SQLITE ? 
    'INSERT INTO migrations (filename) VALUES (?)' : 
    'INSERT INTO migrations (filename) VALUES ($1)';
  await query(insertQuery, [filename]);
};

// Get all migration files
const getMigrationFiles = (): string[] => {
  const migrationsDir = path.join(__dirname, '../../database/migrations');
  const USE_SQLITE = process.env['USE_SQLITE'] === 'true' || process.env['NODE_ENV'] === 'development';
  
  if (!fs.existsSync(migrationsDir)) {
    logger.warn('Migrations directory does not exist');
    return [];
  }
  
  return fs.readdirSync(migrationsDir)
    .filter(file => {
      if (USE_SQLITE) {
        // Prefer SQLite-specific migrations, fallback to regular ones
        return file.endsWith('_sqlite.sql') || 
               (file.endsWith('.sql') && !file.includes('_sqlite') && 
                !fs.existsSync(path.join(migrationsDir, file.replace('.sql', '_sqlite.sql'))));
      } else {
        // Use PostgreSQL migrations (exclude SQLite-specific ones)
        return file.endsWith('.sql') && !file.includes('_sqlite');
      }
    })
    .sort();
};

// Execute a single migration
const executeMigration = async (filename: string): Promise<void> => {
  const migrationPath = path.join(__dirname, '../../database/migrations', filename);
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
    const USE_SQLITE = process.env['USE_SQLITE'] === 'true' || process.env['NODE_ENV'] === 'development';
    
    const result = await query(
      'SELECT filename FROM migrations ORDER BY id DESC LIMIT 1'
    );
    
    if (result.rows.length === 0) {
      logger.info('No migrations to rollback');
      return;
    }
    
    const lastMigration = result.rows[0].filename;
    
    // Remove from migrations table
    const deleteQuery = USE_SQLITE ? 
      'DELETE FROM migrations WHERE filename = ?' : 
      'DELETE FROM migrations WHERE filename = $1';
    await query(deleteQuery, [lastMigration]);
    
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