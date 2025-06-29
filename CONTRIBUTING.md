# Panduan Kontribusi - Amanah Digital

Terima kasih atas minat Anda untuk berkontribusi pada **Amanah Digital**! Proyek ini menggunakan metodologi **Vibe Coding** dengan tim hibrida (manusia + AI).

## 🌟 Metodologi Vibe Coding

Proyek ini mengikuti **Vibe Coding Indonesia V1.4** - metodologi pengembangan hibrida yang memungkinkan kolaborasi efektif antara developer manusia dan AI.

### Prinsip Utama:
- **Baby-Steps Development**: Setiap fitur dipecah menjadi tugas kecil (2-4 tugas per siklus)
- **Tim Hibrida**: Manusia dan AI bekerja sebagai anggota tim setara
- **Documentation First**: Dokumentasi lengkap sebelum coding
- **Security First**: Keamanan adalah prioritas utama
- **Test-Driven**: Setiap tugas memiliki kriteria tes yang jelas

## 👥 Tim Pengembangan

| Nama | Tipe | Peran | Email |
|------|------|-------|-------|
| Neima | Manusia | Product Owner | neima@amanahdigital.com |
| ArsiTek AI | AI | Arsitek / Reviewer | arsitek.ai@amanahdigital.com |
| DevCody | AI | Backend Developer | dev.backend@amanahdigital.com |
| UIDesigner | AI | Frontend Developer | dev.frontend@amanahdigital.com |
| QATester | AI | Quality Assurance | qa.tester@amanahdigital.com |

## 🔄 Alur Kerja Kontribusi

### 1. Persiapan
```bash
# Fork dan clone repository
git clone https://github.com/your-username/amanah-digital.git
cd amanah-digital

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi lokal Anda

# Setup database
npm run db:migrate
npm run db:seed
```

### 2. Memahami Baby-Step Aktif

1. **Baca dokumentasi proyek:**
   - [`memory-bank/papan-proyek.md`](./memory-bank/papan-proyek.md) - Baby-step aktif
   - [`memory-bank/spesifikasi-produk.md`](./memory-bank/spesifikasi-produk.md) - Spesifikasi lengkap
   - [`memory-bank/architecture.md`](./memory-bank/architecture.md) - Arsitektur sistem

2. **Lihat tugas yang tersedia:**
   - Cek kolom `Assignee` di papan proyek
   - Pilih tugas yang sesuai dengan keahlian Anda
   - Koordinasi dengan tim melalui issues/comments

### 3. Development Workflow

#### A. Ambil Tugas
```bash
# Buat branch untuk tugas spesifik
git checkout -b feature/T1-setup-project-structure

# Atau untuk bug fix
git checkout -b fix/authentication-validation
```

#### B. Implementasi
1. **Ikuti kriteria tes** yang sudah didefinisikan di papan proyek
2. **Tulis kode yang clean dan self-explanatory**
3. **Tambahkan komentar** untuk logika bisnis yang kompleks
4. **Ikuti coding standards** (ESLint + Prettier)

#### C. Testing
```bash
# Jalankan tests
npm test

# Test coverage
npm run test:coverage

# Linting
npm run lint

# Format code
npm run format
```

#### D. Commit & Push
```bash
# Commit dengan format yang jelas
git add .
git commit -m "feat(auth): implement JWT authentication middleware

- Add JWT token validation middleware
- Implement refresh token rotation
- Add rate limiting for auth endpoints
- Tests: All auth middleware tests pass

Resolves: T2 - Backend API Authentication
Assignee: DevCody"

# Push ke branch
git push origin feature/T1-setup-project-structure
```

### 4. Pull Request

#### Template PR:
```markdown
## 📋 Deskripsi
Implementasi sistem autentikasi JWT dengan refresh token rotation.

## ✅ Baby-Step & Tugas
- **Baby-Step:** Foundation Setup & Authentication System
- **Tugas:** T2 - Backend API untuk autentikasi
- **Assignee:** DevCody

## 🧪 Kriteria Tes Terpenuhi
- [x] API endpoint `/api/auth/register` berfungsi
- [x] API endpoint `/api/auth/login` berfungsi  
- [x] API endpoint `/api/auth/logout` berfungsi
- [x] Validasi input yang tepat
- [x] Rate limiting implemented
- [x] JWT token generation working

## 🔧 Perubahan Teknis
- Menambahkan middleware autentikasi JWT
- Implementasi refresh token rotation
- Rate limiting untuk endpoint auth
- Validasi input dengan Joi
- Unit tests untuk semua fungsi auth

## 🧪 Testing
```bash
npm test -- auth
npm run test:coverage
```

## 📚 Dokumentasi
- [x] Komentar kode untuk logika kompleks
- [x] API documentation updated
- [x] README updated (jika perlu)

## 🔒 Security Checklist
- [x] Password hashing dengan bcrypt
- [x] JWT secret dari environment variable
- [x] Rate limiting implemented
- [x] Input validation & sanitization
- [x] No sensitive data in logs
```

## 📝 Coding Standards

### TypeScript/JavaScript
```typescript
// ✅ Good - Menjelaskan "mengapa"
// Increment retry counter untuk tracking timeout attempts
// sebelum fallback ke backup authentication server
retryCount++;

// ❌ Bad - Menjelaskan "apa"
// Increment retry count
retryCount++;
```

### Struktur File
```
src/
├── backend/
│   ├── auth/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   └── __tests__/       # Unit tests
│   ├── database/
│   │   ├── migrations/      # Database migrations
│   │   ├── seeds/           # Test data
│   │   └── knexfile.ts      # Database config
│   └── utils/               # Shared utilities
└── frontend/
    ├── components/          # Reusable components
    ├── pages/               # Page components
    ├── services/            # API clients
    ├── hooks/               # Custom React hooks
    └── __tests__/           # Component tests
```

### Commit Message Format
```
type(scope): brief description

- Detailed change 1
- Detailed change 2
- Tests: Description of test results

Resolves: Task ID
Assignee: Developer Name
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🔒 Security Guidelines

### Wajib Diikuti:
1. **Jangan hardcode secrets** - Gunakan environment variables
2. **Validasi semua input** - Gunakan Joi atau express-validator
3. **Hash passwords** - Gunakan bcrypt dengan salt rounds ≥ 12
4. **Sanitize output** - Hindari XSS attacks
5. **Rate limiting** - Implementasi untuk semua public endpoints
6. **HTTPS only** - Tidak ada komunikasi plain HTTP
7. **Audit dependencies** - Jalankan `npm audit` secara berkala

### Enkripsi Data Sensitif:
```typescript
// ✅ Good - Encrypt sensitive data
const encryptedData = CryptoJS.AES.encrypt(
  JSON.stringify(sensitiveData),
  process.env.ENCRYPTION_KEY
).toString();

// ❌ Bad - Plain text storage
const userData = { password: 'plaintext123' };
```

## 🧪 Testing Requirements

### Minimum Coverage:
- **Unit Tests:** 80% coverage
- **Integration Tests:** Critical paths covered
- **Security Tests:** Auth & encryption functions

### Test Structure:
```typescript
describe('Authentication Service', () => {
  describe('login', () => {
    it('should return JWT token for valid credentials', async () => {
      // Arrange
      const credentials = { email: 'test@example.com', password: 'password123' };
      
      // Act
      const result = await authService.login(credentials);
      
      // Assert
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(credentials.email);
    });
    
    it('should throw error for invalid credentials', async () => {
      // Test implementation
    });
  });
});
```

## 📚 Dokumentasi Requirements

### Wajib Update:
1. **README.md** - Jika ada perubahan setup/installation
2. **API Documentation** - Untuk endpoint baru/perubahan
3. **Code Comments** - Untuk logika bisnis kompleks
4. **Architecture.md** - Untuk perubahan arsitektur

### Format Dokumentasi API:
```typescript
/**
 * Authenticate user and return JWT token
 * @route POST /api/auth/login
 * @param {LoginRequest} req.body - User credentials
 * @returns {AuthResponse} JWT token and user data
 * @throws {401} Invalid credentials
 * @throws {429} Too many login attempts
 */
export const login = async (req: Request, res: Response) => {
  // Implementation
};
```

## 🚨 Review Process

### Checklist Reviewer:
- [ ] **Functionality**: Apakah fitur bekerja sesuai kriteria tes?
- [ ] **Security**: Apakah ada vulnerability atau data exposure?
- [ ] **Performance**: Apakah ada bottleneck atau memory leak?
- [ ] **Code Quality**: Apakah kode mudah dibaca dan dipahami?
- [ ] **Tests**: Apakah test coverage memadai?
- [ ] **Documentation**: Apakah dokumentasi up-to-date?

### Approval Process:
1. **Automated Checks**: CI/CD pipeline harus pass
2. **Peer Review**: Minimal 1 reviewer approval
3. **Security Review**: Untuk perubahan auth/encryption
4. **Architecture Review**: Untuk perubahan struktur besar

## 🐛 Bug Reports

### Template Issue:
```markdown
## 🐛 Bug Description
Deskripsi singkat bug yang ditemukan.

## 🔄 Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## ✅ Expected Behavior
Apa yang seharusnya terjadi.

## ❌ Actual Behavior
Apa yang benar-benar terjadi.

## 🌍 Environment
- OS: [e.g. Windows 11]
- Node.js: [e.g. 18.17.0]
- Browser: [e.g. Chrome 119]
- Database: [e.g. PostgreSQL 14]

## 📸 Screenshots
(Jika applicable)

## 🔍 Additional Context
Informasi tambahan yang relevan.
```

## 💡 Feature Requests

### Template:
```markdown
## 💡 Feature Description
Deskripsi fitur yang diinginkan.

## 🎯 Problem Statement
Masalah apa yang akan diselesaikan fitur ini?

## 💭 Proposed Solution
Solusi yang diusulkan.

## 🔄 Alternative Solutions
Alternatif solusi lain yang dipertimbangkan.

## 📊 Impact Assessment
- **Users Affected**: [High/Medium/Low]
- **Development Effort**: [High/Medium/Low]
- **Security Impact**: [High/Medium/Low/None]
- **Performance Impact**: [High/Medium/Low/None]
```

## 📞 Bantuan & Komunikasi

- **Issues**: Gunakan GitHub Issues untuk bug reports dan feature requests
- **Discussions**: GitHub Discussions untuk pertanyaan umum
- **Email**: dev@amanahdigital.com untuk pertanyaan sensitif
- **Documentation**: Lihat folder `vibe-guide/` untuk panduan lengkap

## 📄 Lisensi

Dengan berkontribusi pada proyek ini, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah [MIT License](LICENSE).

---

**Terima kasih telah berkontribusi pada Amanah Digital!** 🙏

Setiap kontribusi, sekecil apapun, sangat berarti untuk membantu keluarga Indonesia merencanakan warisan digital dengan aman dan sesuai hukum.