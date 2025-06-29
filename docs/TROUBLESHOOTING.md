# Panduan Troubleshooting - Amanah Digital

## Development Setup Issues

### 1. Database Connection Error

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solusi:**
1. Pastikan PostgreSQL service berjalan:
   ```bash
   # Windows
   net start postgresql-x64-14
   
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. Cek konfigurasi database di `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=amanah_digital
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

3. Test koneksi database:
   ```bash
   psql -h localhost -U postgres -d amanah_digital
   ```

### 2. JWT Secret Missing

**Error:**
```
Error: JWT_SECRET is required
```

**Solusi:**
1. Copy `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```

2. Generate JWT secret yang aman:
   ```bash
   # Menggunakan Node.js
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   
   # Atau menggunakan OpenSSL
   openssl rand -hex 64
   ```

3. Tambahkan ke `.env`:
   ```env
   JWT_SECRET=your_generated_secret_here
   JWT_EXPIRE=24h
   JWT_COOKIE_EXPIRE=1
   ```

### 3. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solusi:**
1. Cari process yang menggunakan port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # macOS/Linux
   lsof -i :5000
   ```

2. Kill process atau gunakan port lain:
   ```bash
   # Kill process (ganti PID dengan hasil dari command di atas)
   taskkill /PID <PID> /F  # Windows
   kill -9 <PID>           # macOS/Linux
   
   # Atau ubah port di .env
   PORT=5001
   ```

### 4. TypeScript Compilation Error

**Error:**
```
Error: Cannot find module '@/types/user'
```

**Solusi:**
1. Pastikan path mapping di `tsconfig.json` benar:
   ```json
   {
     "compilerOptions": {
       "baseUrl": "./src",
       "paths": {
         "@/*": ["*"]
       }
     }
   }
   ```

2. Restart TypeScript compiler:
   ```bash
   # Jika menggunakan VS Code
   Ctrl+Shift+P -> "TypeScript: Restart TS Server"
   
   # Atau restart development server
   npm run dev
   ```

### 5. CORS Error di Frontend

**Error:**
```
Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solusi:**
1. Pastikan CORS dikonfigurasi dengan benar di backend:
   ```typescript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
     credentials: true
   }));
   ```

2. Set environment variable:
   ```env
   FRONTEND_URL=http://localhost:3000
   ```

## Runtime Issues

### 1. Authentication Token Expired

**Error:**
```
{
  "success": false,
  "error": { "message": "jwt expired" }
}
```

**Solusi:**
1. Implement token refresh mechanism
2. Redirect user ke login page
3. Clear stored token dari localStorage/cookies

### 2. Password Hashing Error

**Error:**
```
Error: data and salt arguments required
```

**Solusi:**
1. Pastikan bcrypt salt rounds dikonfigurasi:
   ```typescript
   const saltRounds = 12;
   const hashedPassword = await bcrypt.hash(password, saltRounds);
   ```

2. Validasi input password tidak kosong:
   ```typescript
   if (!password || password.length < 6) {
     throw new Error('Password must be at least 6 characters');
   }
   ```

### 3. Database Migration Error

**Error:**
```
Error: relation "users" does not exist
```

**Solusi:**
1. Jalankan migration:
   ```bash
   npm run db:migrate
   ```

2. Jika masih error, reset database:
   ```bash
   npm run db:reset
   ```

3. Cek status migration:
   ```bash
   npx knex migrate:status
   ```

## Performance Issues

### 1. Slow Database Queries

**Gejala:** Response time > 2 detik

**Solusi:**
1. Add database indexes:
   ```sql
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_users_created_at ON users(created_at);
   ```

2. Implement connection pooling:
   ```typescript
   const pool = new Pool({
     max: 20,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });
   ```

3. Use query optimization:
   ```sql
   -- Bad
   SELECT * FROM users WHERE email LIKE '%@gmail.com';
   
   -- Good
   SELECT id, email, first_name FROM users WHERE email = $1;
   ```

### 2. Memory Leaks

**Gejala:** Memory usage terus meningkat

**Solusi:**
1. Close database connections:
   ```typescript
   try {
     const result = await query('SELECT * FROM users');
     return result;
   } finally {
     // Connection akan otomatis di-return ke pool
   }
   ```

2. Remove event listeners:
   ```typescript
   process.on('SIGTERM', () => {
     server.close(() => {
       pool.end();
     });
   });
   ```

## Security Issues

### 1. SQL Injection Prevention

**Bad:**
```typescript
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

**Good:**
```typescript
const result = await query('SELECT * FROM users WHERE email = $1', [email]);
```

### 2. XSS Prevention

**Solusi:**
1. Sanitize input:
   ```typescript
   import validator from 'validator';
   
   const sanitizedEmail = validator.normalizeEmail(email);
   const escapedName = validator.escape(name);
   ```

2. Set proper headers:
   ```typescript
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'", "'unsafe-inline'"],
       },
     },
   }));
   ```

## Debugging Tips

### 1. Enable Debug Logging

```env
NODE_ENV=development
LOG_LEVEL=debug
```

### 2. Use Debugger

```typescript
// Tambahkan breakpoint
debugger;

// Atau gunakan console.log dengan context
console.log('Auth middleware - token:', token?.substring(0, 10) + '...');
```

### 3. Database Query Logging

```typescript
const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
console.log('Query executed:', result.command, 'Rows:', result.rowCount);
```

## Getting Help

1. **Check logs:** `tail -f logs/app.log`
2. **Database logs:** Check PostgreSQL logs
3. **Network issues:** Use browser dev tools Network tab
4. **API testing:** Use Postman atau curl
5. **Code review:** Konsultasi dengan tim Arsitek

---

*Jika masalah masih berlanjut, buat issue di repository dengan detail error message dan langkah reproduksi.*