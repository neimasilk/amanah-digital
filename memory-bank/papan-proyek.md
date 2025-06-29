# Papan Proyek: Amanah Digital

### STATUS [Update: 2024-12-19]
- **Fase Proyek:** Inisialisasi & Setup MVP
- **Progress:** Spesifikasi produk, arsitektur sistem, dan dokumentasi foundation telah selesai
- **Tim:** 5 anggota (1 manusia, 4 AI) telah terdaftar
- **Dokumentasi:** README.md, CONTRIBUTING.md, package.json, .env.example, .gitignore telah dibuat
- **Next:** DevCody dapat memulai T1 (setup struktur proyek) dengan dokumentasi yang lengkap

### REFERENSI ARSIP
- Belum ada arsip baby-step (proyek baru dimulai)
- Proposal awal: `memory-bank/Aplikasi Perencanaan Warisan Digital — _Amanah Digital_.md`

### BABY-STEP BERJALAN: Foundation Setup & Authentication System

**Tujuan:** Membangun fondasi teknis aplikasi dengan sistem autentikasi yang aman dan struktur proyek yang scalable. Baby-step ini akan menghasilkan aplikasi web dasar dengan login/register yang berfungsi.

**Tugas:**

- [ ] **T1:** Setup struktur proyek dan development environment | **File:** `src/` (struktur folder) | **Tes:** Proyek dapat di-clone dan dijalankan dengan `npm install && npm start` | **Assignee:** DevCody

- [ ] **T2:** Implementasi backend API untuk autentikasi (register, login, logout) | **File:** `src/backend/auth/` | **Tes:** API endpoint `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` berfungsi dengan validasi yang tepat | **Assignee:** DevCody

- [ ] **T3:** Implementasi frontend untuk halaman login dan register | **File:** `src/frontend/pages/auth/` | **Tes:** User dapat register akun baru dan login dengan credentials yang valid | **Assignee:** UIDesigner

- [ ] **T4:** Setup database schema untuk user management | **File:** `src/backend/database/migrations/` | **Tes:** Database dapat dibuat dengan schema user yang lengkap (id, email, password_hash, created_at, updated_at) | **Assignee:** DevCody

- [ ] **T5:** Implementasi middleware keamanan (JWT, password hashing, rate limiting) | **File:** `src/backend/middleware/` | **Tes:** Password di-hash dengan bcrypt, JWT token valid selama 24 jam, rate limiting 5 requests/minute untuk login | **Assignee:** DevCody

- [ ] **T6:** Testing dan validasi sistem autentikasi | **File:** `src/tests/auth/` | **Tes:** Semua test case autentikasi pass (unit test + integration test) | **Assignee:** QATester

### KRITERIA SUKSES BABY-STEP
1. ✅ User dapat mengakses aplikasi di browser
2. ✅ User dapat register dengan email dan password
3. ✅ User dapat login dengan credentials yang benar
4. ✅ User mendapat error message yang jelas untuk input yang salah
5. ✅ Session management berfungsi (user tetap login setelah refresh)
6. ✅ Logout berfungsi dan menghapus session
7. ✅ Database connection stabil dan schema sesuai rancangan

### TEKNOLOGI YANG DIGUNAKAN
- **Backend:** Node.js + Express.js + TypeScript
- **Frontend:** React.js + TypeScript + Material-UI
- **Database:** PostgreSQL
- **Authentication:** JWT + bcrypt
- **Development:** Docker untuk database, ESLint + Prettier

### SARAN & RISIKO

**Saran Teknis:**
- Gunakan environment variables untuk konfigurasi database dan JWT secret
- Implementasi input validation yang ketat di frontend dan backend
- Setup CORS dengan benar untuk development dan production
- Gunakan HTTPS bahkan di development environment

**Risiko yang Perlu Diawasi:**
- **Security Risk:** Pastikan password tidak pernah di-log atau di-return dalam response
- **Database Risk:** Setup connection pooling untuk menghindari connection limit
- **Performance Risk:** Implementasi rate limiting untuk mencegah brute force attack
- **UX Risk:** Berikan feedback yang jelas untuk setiap action (loading states, error messages)

**Dependencies yang Dibutuhkan:**
- PostgreSQL database (bisa menggunakan Docker)
- Node.js v18+ dan npm
- Git untuk version control

### PERSIAPAN BABY-STEP BERIKUTNYA
Setelah baby-step ini selesai, baby-step berikutnya akan fokus pada:
1. **User Profile Management** - CRUD profile, upload foto, preferences
2. **Asset Inventory Basic** - Form untuk input aset fisik dan digital
3. **Dashboard Layout** - Navigation, sidebar, responsive design

---

### 🔗 REFERENSI PANDUAN
- **📊 Lihat ringkasan proyek**: `memory-bank/summary-report.md` atau `./vibe-guide/init_vibe.sh --dashboard`
- **Jika mengalami bug kompleks**: Lihat [Panduan Debugging & Git Recovery](./DEBUGGING_GIT.md)
- **Untuk review kode**: Konsultasi dengan [Dokumenter](./roles/dokumenter.md)
- **Untuk testing**: Koordinasi dengan [Tester](./roles/tester.md)
- **Untuk arsitektur**: Diskusi dengan [Arsitek](./roles/arsitek.md)
