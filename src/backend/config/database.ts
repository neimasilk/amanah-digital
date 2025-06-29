import { Pool } from 'pg';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

const config: DatabaseConfig = {
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432'),
  database: process.env['DB_NAME'] || 'amanah_digital',
  user: process.env['DB_USER'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'password',
  ssl: process.env['NODE_ENV'] === 'production'
};

// Use SQLite for development if PostgreSQL is not available
const USE_SQLITE = process.env['USE_SQLITE'] === 'true' || process.env['NODE_ENV'] === 'development';
const SQLITE_PATH = process.env['SQLITE_PATH'] || './database.sqlite';

let pool: Pool | null = null;
let sqliteDb: sqlite3.Database | null = null;

if (USE_SQLITE) {
  sqliteDb = new sqlite3.Database(SQLITE_PATH, (err) => {
    if (err) {
      logger.error('SQLite connection failed:', err);
    } else {
      logger.info('Connected to SQLite database');
    }
  });
} else {
  pool = new Pool(config);
}

export const connectDatabase = async (): Promise<void> => {
  try {
    if (USE_SQLITE && sqliteDb) {
      // SQLite is already connected in constructor
      logger.info('SQLite database ready');
      return;
    }
    
    if (pool) {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      logger.info(`PostgreSQL connected at ${result.rows[0].now}`);
      client.release();
    }
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    let result: any;
    
    if (USE_SQLITE && sqliteDb) {
      // Convert PostgreSQL-style queries to SQLite
      const sqliteQuery = text.replace(/\$\d+/g, '?');
      
      result = await new Promise((resolve, reject) => {
        if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
          sqliteDb!.all(sqliteQuery, params || [], (err, rows) => {
            if (err) reject(err);
            else resolve({ rows, rowCount: rows.length });
          });
        } else {
          sqliteDb!.run(sqliteQuery, params || [], function(err) {
            if (err) reject(err);
            else resolve({ rows: [], rowCount: this.changes, insertId: this.lastID });
          });
        }
      });
    } else if (pool) {
      result = await pool.query(text, params);
    } else {
      throw new Error('No database connection available');
    }
    
    const duration = Date.now() - start;
    logger.debug(`Query executed in ${duration}ms: ${text}`);
    return result;
  } catch (error) {
    logger.error('Query error:', error);
    throw error;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down database connection...');
  if (pool) {
    await pool.end();
  }
  if (sqliteDb) {
    sqliteDb.close();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down database connection...');
  if (pool) {
    await pool.end();
  }
  if (sqliteDb) {
    sqliteDb.close();
  }
  process.exit(0);
});

export { pool, sqliteDb };