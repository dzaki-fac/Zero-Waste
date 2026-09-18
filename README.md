# Zero Waste — ZeroLib Perpustakaan UNDIP

Aplikasi web pengelolaan sampah **Zero Waste** untuk Perpustakaan UNDIP (disebut juga **ZeroLib** di konfigurasi).

Aplikasi mencatat alur sampah dari hulu ke hilir — **Penimbangan → Pilah Sampah → Distribusi** — dilengkapi dashboard statistik, checklist pekerjaan petugas, manajemen dokumen/SOP/peraturan, berita, poster, dan ekspor data.

> Stack: **Laravel 13 + Inertia.js 3 + React 19 + TypeScript + Tailwind CSS 4 + MySQL**

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Kebutuhan Sistem](#kebutuhan-sistem)
- [Instalasi](#instalasi)
- [Akun Default (Seeder)](#akun-default-seeder)
- [Role & Hak Akses](#role--hak-akses)
- [Alur Data Sampah](#alur-data-sampah)
- [Struktur Proyek](#struktur-proyek)
- [Perintah Penting](#perintah-penting)
- [Pengujian & Kualitas Kode](#pengujian--kualitas-kode)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Catatan](#catatan)

---

## Fitur Utama

### Halaman Publik (tanpa login)
- **Landing page** (`/`) — statistik sampah, grafik per area / jenis / tujuan distribusi, berita, dan poster.
- **SOP** (`/sop`), **Pengertian** (`/pengertian`), **Struktur** (`/struktur`), **Peraturan** (`/peraturan`) — konten dokumen yang dikelola admin.

### Form Petugas (login, semua role)
- Form **Penimbangan**, **Pilah Sampah**, **Distribusi**, dan **Checklist Pekerjaan** (`/form/*`).

### Dashboard Admin (`/admin/*`)
- Dashboard statistik + progres checklist harian/mingguan/bulanan + statistik per petugas.
- CRUD **Penimbangan**, **Pilah Sampah**, **Distribusi** (dengan **review approve/reject**).
- **Checklist Pekerjaan** — lihat, riwayat per petugas, ekspor per tanggal & ekspor semua.
- **Kelola Pekerjaan** (master pekerjaan harian/mingguan/bulanan).
- **Data Dasar** & **Kelola Data** (opsi dropdown: rincian area, jenis sampah, dll).
- **Dokumen** (SOP/struktur/peraturan), **Berita**, **Poster** (dengan publikasi & urutan tampil).
- **Akun** — kelola user admin & petugas.
- **Ekspor** data ke spreadsheet (penimbangan, pilah, distribusi, checklist, data dasar).

### Dashboard Petugas (`/petugas/*`)
- Dashboard pribadi + CRUD Penimbangan, Pilah Sampah, Distribusi milik sendiri + checklist pekerjaan sendiri.

---

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Backend | PHP 8.3, Laravel 13, Inertia Laravel 3, Fortify (auth), Wayfinder |
| Frontend | React 19, TypeScript, Inertia React 3, Vite 8, Tailwind CSS 4, shadcn/ui + Radix, Recharts, Framer Motion, Lucide |
| Database | MySQL (`zero_waste`), session/cache/queue via database |
| Dev tools | Pest 4 (testing), PHPStan/Larastan, Pint, ESLint, Prettier, `tsc` |

---

## Kebutuhan Sistem

- **PHP >= 8.3** + ekstensi umum Laravel (mbstring, xml, bcmath, fileinfo, dsb.)
- **Composer 2**
- **Node.js >= 20** + npm
- **MySQL >= 8** (default DB `zero_waste`)
- Git

---

## Instalasi

### 1. Clone & masuk direktori

```bash
git clone <repo-url> zero-waste
cd zero-waste
```

### 2. Install dependency

```bash
composer install
npm install
```

### 3. Siapkan environment

```bash
cp .env.example .env
php artisan key:generate
```

Sesuaikan `.env`, minimal:

```env
APP_NAME=ZeroLib
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=zero_waste
DB_USERNAME=root
DB_PASSWORD=
```

> Buat database `zero_waste` terlebih dahulu di MySQL.

### 4. Migrasi + seeder

```bash
php artisan migrate --seed
```

Seeder mengisi: akun admin/petugas, master pekerjaan, kelola data (opsi dropdown), dan data dasar.

### 5. Jalankan aplikasi (development)

Jalankan server Laravel, queue listener, dan Vite sekaligus:

```bash
composer dev
```

Atau manual (3 terminal):

```bash
php artisan serve
php artisan queue:listen --tries=1
npm run dev
```

Buka **http://localhost:8000**.

### 6. Build production

```bash
npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

> Ada juga shortcut `composer setup` yang menjalankan `composer install` + copy `.env` + `key:generate` + `migrate` + `npm install` + `npm run build`.

---

## Akun Default (Seeder)

Akun di bawah dibuat oleh `database/seeders/AkunSeeder.php`. **Ganti password setelah deploy / jangan pakai di production.**

| Nama | Email | Role |
|---|---|---|
| Suwondo, S.Hum., M.Kom. | `suwondo@perpus.undip` | admin |
| Linda Wahyuningsih, S.I.Kom., M.I.Kom. | `linda@perpus.undip` | admin |
| Partini | `partini@perpus.undip` | petugas |
| Nasto | `nasto@perpus.undip` | petugas |
| Kasnawi | `kasnawi@perpus.undip` | petugas |
| Heri Dwi Pramianto | `heri@perpus.undip` | petugas |

Password masing-masing akun ada di `AkunSeeder.php` (format `12345678 + inisial`). Contoh pola: akun admin Suwondo → `12345678s`.

Login di `/login` (Fortify). Setelah login, user diarahkan ke dashboard sesuai role (`/admin/dashboard` atau `/petugas/dashboard`).

---

## Role & Hak Akses

| Rute | Admin | Petugas | Publik |
|---|---|---|---|
| `/`, `/sop`, `/pengertian`, `/struktur`, `/peraturan` | ✅ | ✅ | ✅ |
| `/form/*` (input penimbangan/pilah/distribusi/checklist) | ✅ | ✅ | ❌ |
| `/admin/*` (dashboard, CRUD semua data, review distribusi, kelola pekerjaan/data dasar/dokumen/berita/poster/akun) | ✅ | ❌ | ❌ |
| `/petugas/*` (dashboard + data milik sendiri) | ❌ | ✅ | ❌ |

Penegakan role memakai middleware `App\Http\Middleware\CheckRole` (`admin` / `petugas`).

---

## Alur Data Sampah

```text
Penimbangan (berat_sampah per area)
   └─> Pilah Sampah (berat per jenis_sampah)
          └─> Distribusi (berat per tujuan, perlu review_status = approved)
```

Dashboard menghitung:

- `menunggu_pemilahan = totalPenimbangan - totalPilah`
- `siap_didistribusikan = totalPilah - totalDistribusiApproved`
- `sudah_didistribusikan = totalDistribusiApproved`

Semua angka bisa difilter rentang tanggal (`start_date` / `end_date`).

---

## Struktur Proyek

```text
app/
  Http/Controllers/   # Home, Dashboard, Penimbangan, PilahSampah, Distribusi,
                      # ChecklistPekerjaan, MasterPekerjaan, KelolaData, DataDasar,
                      # Document, News, Poster, Akun
  Http/Middleware/    # CheckRole
  Models/             # User, Penimbangan, PilahSampah, Distribusi,
                      # MasterPekerjaan, ChecklistPekerjaan, KelolaData,
                      # DataDasar, Document, News, Poster
  Helpers/            # OptionHelper (opsi dropdown dinamis)
routes/
  web.php             # publik + form + admin + petugas
  admin.php           # manajemen akun
  console.php
resources/
  js/pages/           # home, admin/*, petugas (dashboard), form/*,
                      # SOPPage, pengertian, struktur, peraturan, ...
  js/components/      # Navbar, charts, ui (shadcn), ...
  js/layouts/         # layout admin / petugas / publik
database/
  migrations/         # users, penimbangan, pilah_sampah, distribusi (+review),
                      # master_pekerjaan, checklist_pekerjaan, kelola_data,
                      # data_dasar, news, posters, documents
  seeders/            # Akun, MasterPekerjaan, KelolaData, DataDasar, ...
```

---

## Perintah Penting

```bash
# Development (server + queue + vite)
composer dev

# Testing (Pest)
php artisan test

# Cek lengkap CI: eslint + prettier + tsc + pest
composer ci:check

# Lint & format
composer lint              # pint (PHP)
npm run lint               # eslint --fix
npm run format             # prettier --write resources/
npm run types:check        # tsc --noEmit
composer types:check       # phpstan analyse
```

---

## Pengujian & Kualitas Kode

- Test: **Pest 4** (`tests/`, config `phpunit.xml`).
- Static analysis: **Larastan / PHPStan** (`phpstan.neon`).
- Style PHP: **Pint** (`pint.json`).
- Style JS/TS: **ESLint** (`eslint.config.js`) + **Prettier** (`.prettierrc`, `.prettierignore`).

---

## Konfigurasi Environment

Selain DB, yang relevan dari `.env.example`:

| Key | Default | Keterangan |
|---|---|---|
| `APP_NAME` | `ZeroLib` | Nama aplikasi |
| `SESSION_DRIVER` | `database` | Session via DB |
| `CACHE_STORE` | `database` | Cache via DB |
| `QUEUE_CONNECTION` | `database` | Queue via DB (jangan lupa `queue:listen`) |
| `MAIL_MAILER` | `log` | Email hanya ke log (dev) |
| `FILESYSTEM_DISK` | `local` | Upload dokumen/poster ke storage lokal |

---

## Catatan

- File upload (dokumen/poster) tersimpan di `storage/app` — jalankan `php artisan storage:link` jika perlu diakses publik.
- Proyek ini berasal dari `laravel/react-starter-kit`, jadi beberapa config bawaan starter kit masih ada.
- Jika grafik/dashboard kosong, isi dulu data via `/form` atau jalankan seeder contoh (`PenimbanganSeeder`, `PilahSampahSeeder`, `DistribusiSeeder` — saat ini dikomentari di `DatabaseSeeder`).
