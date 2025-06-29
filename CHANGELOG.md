# Changelog

Semua perubahan penting pada proyek **Amanah Digital** akan didokumentasikan dalam file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Setup struktur proyek dengan metodologi Vibe Coding
- Dokumentasi foundation lengkap (README, CONTRIBUTING, LICENSE)
- Konfigurasi development environment (package.json, tsconfig.json, ESLint, Prettier)
- Docker Compose untuk development database (PostgreSQL, Redis, pgAdmin, MailHog)
- Environment variables template (.env.example)
- Git configuration (.gitignore)

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- Konfigurasi ESLint dengan security rules
- Environment variables untuk sensitive data
- Docker development environment dengan proper networking

---

## [0.1.0] - 2024-12-19

### Added
- **Inisialisasi Proyek**: Setup awal proyek Amanah Digital
- **Spesifikasi Produk**: PRD lengkap dengan visi, misi, dan fitur MVP
- **Arsitektur Sistem**: Desain microservices dengan security-first approach
- **Team Manifest**: Tim hibrida 5 anggota (1 manusia + 4 AI)
- **Baby-Step Planning**: Roadmap development dengan Foundation Setup
- **Dokumentasi Lengkap**:
  - README.md dengan quick start guide
  - CONTRIBUTING.md dengan panduan Vibe Coding
  - Spesifikasi produk dan arsitektur sistem
  - Progress tracking dan summary report

### Technical Stack Decisions
- **Backend**: Node.js + Express.js + TypeScript
- **Frontend**: React.js + TypeScript + Material-UI
- **Database**: PostgreSQL dengan enkripsi AES-256
- **Authentication**: JWT dengan bcrypt password hashing
- **Development**: Docker, ESLint, Prettier, Jest
- **Deployment**: Cloud-native dengan Kubernetes

### Security Features
- End-to-end encryption untuk vault digital
- JWT authentication dengan refresh token rotation
- Rate limiting untuk API endpoints
- Input validation dan sanitization
- Security-focused ESLint rules

### Documentation
- Comprehensive README dengan installation guide
- Contributing guidelines dengan Vibe Coding methodology
- Code of conduct dan security guidelines
- API documentation structure
- Development environment setup

---

## Roadmap

### [0.2.0] - Foundation Setup (Target: 2025-01-02)
- [ ] Project structure setup (src/backend, src/frontend)
- [ ] Database schema dan migrations
- [ ] Authentication system (register, login, logout)
- [ ] Basic frontend dengan login/register pages
- [ ] Testing framework setup
- [ ] CI/CD pipeline basic

### [0.3.0] - Vault Digital (Target: 2025-01-15)
- [ ] Encrypted storage untuk credentials
- [ ] Asset inventory management
- [ ] File upload untuk dokumen
- [ ] Emergency access system
- [ ] Backup dan recovery

### [0.4.0] - Kalkulator Faraid (Target: 2025-02-01)
- [ ] Input komposisi keluarga
- [ ] Perhitungan pembagian waris Islam
- [ ] Visualisasi chart/diagram
- [ ] Export PDF hasil perhitungan
- [ ] Validasi hukum waris

### [0.5.0] - Template Wasiat (Target: 2025-02-15)
- [ ] Template wasiat KUHPerdata
- [ ] Panduan batasan wasiat Islam
- [ ] Integrasi direktori notaris
- [ ] Validitas dokumen checker
- [ ] Legal compliance check

### [1.0.0] - MVP Launch (Target: 2025-03-01)
- [ ] Security audit lengkap
- [ ] Performance optimization
- [ ] User acceptance testing
- [ ] Production deployment
- [ ] Marketing website
- [ ] User onboarding flow

---

## Konvensi Changelog

### Types of Changes
- **Added** untuk fitur baru
- **Changed** untuk perubahan pada fitur yang sudah ada
- **Deprecated** untuk fitur yang akan dihapus di versi mendatang
- **Removed** untuk fitur yang dihapus di versi ini
- **Fixed** untuk bug fixes
- **Security** untuk vulnerability fixes

### Commit Message Format
```
type(scope): brief description

- Detailed change 1
- Detailed change 2
- Tests: Description of test results

Resolves: Task ID
Assignee: Developer Name
```

### Version Numbering
- **MAJOR**: Breaking changes atau milestone besar
- **MINOR**: Fitur baru yang backward compatible
- **PATCH**: Bug fixes dan improvements kecil

---

**Amanah Digital** - Membantu keluarga Indonesia merencanakan warisan digital dengan aman dan sesuai hukum.