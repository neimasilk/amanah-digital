-- Created: 2024-12-19
-- Description: Initial user table for authentication system (SQLite version)

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    is_verified INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    reset_password_token TEXT,
    reset_password_expire TEXT,
    email_verification_token TEXT,
    email_verification_expire TEXT,
    last_login TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_password_token);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
    AFTER UPDATE ON users 
    FOR EACH ROW 
    BEGIN
        UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
    END;

-- Insert default admin user (password: Admin123!)
-- Note: This should be changed in production
INSERT OR IGNORE INTO users (email, password_hash, first_name, last_name, role, is_verified, is_active)
VALUES (
    'admin@amanahdigital.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO9G', -- Admin123!
    'Admin',
    'User',
    'admin',
    1,
    1
);