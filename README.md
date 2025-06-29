# Amanah Digital - Islamic Inheritance Planning Platform

![Amanah Digital Logo](./docs/images/logo.png)

**Amanah Digital** adalah platform digital terdepan untuk perencanaan warisan Islam di Indonesia. Platform ini dirancang khusus untuk keluarga Muslim kelas menengah dan profesional urban yang membutuhkan solusi modern untuk mengelola aset digital dan perencanaan warisan sesuai syariat Islam.

## 🎯 Tentang Proyek

**Amanah Digital** adalah aplikasi perencanaan warisan digital yang membantu masyarakat Indonesia menavigasi tiga sistem hukum waris yang berlaku:
- **Hukum Waris Perdata/BW** (KUHPerdata)
- **Hukum Waris Islam/Faraid** 
- **Hukum Waris Adat**

Sekaligus mengatasi tantangan pewarisan aset digital modern seperti cryptocurrency, akun media sosial, dan domain digital.

## ✨ Fitur Utama (MVP)

### 🔐 Vault Digital Terenkripsi
- Penyimpanan aman credentials aset digital
- Enkripsi end-to-end untuk private keys crypto
- Sistem akses darurat untuk ahli waris

### 📊 Kalkulator Faraid (Killer Feature)
- Perhitungan otomatis pembagian waris sesuai hukum Islam
- Visualisasi pembagian dalam bentuk chart/diagram
- Export hasil perhitungan dalam format PDF

### 📋 Inventarisasi Aset
- Katalog aset fisik dan digital
- Estimasi nilai dan dokumentasi kepemilikan
- Kategorisasi berdasarkan sistem hukum yang berlaku

### 📄 Template Wasiat & Panduan
- Template wasiat sesuai KUHPerdata Indonesia
- Panduan batasan wasiat dalam hukum Islam
- Integrasi dengan direktori notaris terverifikasi

## 🏗️ Arsitektur Teknis

### Tech Stack
- **Backend:** Node.js + Express.js + TypeScript
- **Frontend:** React.js + TypeScript + Material-UI
- **Database:** PostgreSQL
- **Authentication:** JWT + bcrypt
- **Security:** AES-256 encryption, end-to-end encryption
- **Deployment:** Cloud-native dengan Kubernetes

### Arsitektur
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile Apps   │    │   Web Client    │    │  Partner APIs   │
│  (iOS/Android)  │    │     (PWA)       │    │ (White-label)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Gateway   │
                    │  (Rate Limiting │
                    │   & Security)   │
                    └─────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                       │                        │
┌───────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Auth Service │    │  Core Services  │    │ External APIs   │
│   (JWT/OAuth) │    │   (Business     │    │  (Notaris,      │
│               │    │    Logic)       │    │   Payment)      │
└───────────────┘    └─────────────────┘    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Data Layer    │
                    │ (PostgreSQL +   │
                    │  Encrypted      │
                    │   Storage)      │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Docker (optional, untuk development)

### Installation

```bash
# Clone repository
git clone https://github.com/amanah-digital/amanah-digital.git
cd amanah-digital

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan konfigurasi database dan JWT secret

# Setup database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### Development Commands

```bash
# Frontend development
npm run dev:frontend

# Backend development  
npm run dev:backend

# Run tests
npm test

# Build for production
npm run build

# Database operations
npm run db:migrate
npm run db:rollback
npm run db:seed
```

## 📁 Struktur Proyek

```
amanah-digital/
├── src/
│   ├── backend/           # Node.js API server
│   │   ├── auth/          # Authentication services
│   │   ├── database/      # Database models & migrations
│   │   ├── middleware/    # Express middleware
│   │   └── services/      # Business logic services
│   ├── frontend/          # React.js application
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client services
│   │   └── utils/         # Utility functions
│   └── tests/             # Test suites
├── memory-bank/           # Project documentation
│   ├── spesifikasi-produk.md
│   ├── architecture.md
│   ├── papan-proyek.md
│   └── progress.md
├── vibe-guide/            # Development guidelines
└── baby-steps-archive/    # Development history
```

## 👥 Tim Pengembangan

| Nama | Peran | Email |
|------|-------|-------|
| Neima | Product Owner | neima@amanahdigital.com |
| ArsiTek AI | Arsitek / Reviewer | arsitek.ai@amanahdigital.com |
| DevCody | Backend Developer | dev.backend@amanahdigital.com |
| UIDesigner | Frontend Developer | dev.frontend@amanahdigital.com |
| QATester | Quality Assurance | qa.tester@amanahdigital.com |

## 📊 Status Proyek

- **Fase Saat Ini:** Foundation Setup & Authentication System
- **Progress:** 15% (Dokumentasi selesai, development dimulai)
- **Target Milestone:** Working authentication system (Est. 2 minggu)
- **Baby-Steps Selesai:** 0/1

### Roadmap MVP (Q1 2025)

- [x] **Fase 0:** Inisialisasi & Dokumentasi ✅
- [ ] **Fase 1:** Foundation Setup & Authentication (In Progress)
- [ ] **Fase 2:** Vault Digital & Asset Management
- [ ] **Fase 3:** Kalkulator Faraid
- [ ] **Fase 4:** Template Wasiat & Legal Integration
- [ ] **Fase 5:** Testing & Security Audit
- [ ] **Fase 6:** MVP Launch

## 🔒 Keamanan

Proyek ini mengutamakan keamanan data pengguna:

- **Enkripsi End-to-End:** Semua data sensitif dienkripsi dengan AES-256
- **Authentication:** JWT dengan refresh token rotation
- **Password Security:** bcrypt dengan salt rounds 12
- **Rate Limiting:** Proteksi terhadap brute force attacks
- **Input Validation:** Sanitasi dan validasi semua input pengguna
- **HTTPS Only:** Semua komunikasi menggunakan TLS 1.3

## 📚 Dokumentasi

- **[Spesifikasi Produk](./memory-bank/spesifikasi-produk.md)** - PRD lengkap dengan visi dan fitur
- **[Arsitektur Sistem](./memory-bank/architecture.md)** - Desain teknis dan infrastruktur
- **[Panduan Development](./vibe-guide/VIBE_CODING_GUIDE.md)** - Workflow dan best practices
- **[Progress Log](./memory-bank/progress.md)** - Catatan perkembangan proyek
- **[Papan Proyek](./memory-bank/papan-proyek.md)** - Baby-step dan task management

## 🤝 Kontribusi

Proyek ini menggunakan **Vibe Coding methodology** dengan tim hibrida (manusia + AI). 

Untuk berkontribusi:
1. Baca [Panduan Vibe Coding](./vibe-guide/VIBE_CODING_GUIDE.md)
2. Lihat [Papan Proyek](./memory-bank/papan-proyek.md) untuk task yang tersedia
3. Follow workflow baby-steps untuk development
4. Pastikan semua test pass sebelum commit

## 📄 Lisensi

MIT License - lihat [LICENSE](LICENSE) untuk detail.

## 📞 Kontak

- **Email:** info@amanahdigital.com
- **Website:** [amanahdigital.com](https://amanahdigital.com)
- **Documentation:** [docs.amanahdigital.com](https://docs.amanahdigital.com)

---

**Amanah Digital** - Membantu keluarga Indonesia merencanakan warisan digital dengan aman dan sesuai hukum.