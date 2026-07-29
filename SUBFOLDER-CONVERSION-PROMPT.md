# Prompt: Konversi Project Agar Bisa Jalan di Subfolder

Berikan prompt ini ke coding agent untuk mengonversi project Laravel+Inertia+React (atau framework serupa) yang tadinya hanya bisa jalan di root domain (`http://domain.com/`) agar bisa juga jalan di subfolder (`http://host/subfolder/`).

---

## Tugas

Konversi project di `{PATH_PROJECT}` agar bisa diakses via subfolder `/{SUBFOLDER}` (misal `http://10.107.93.41/zero-waste`).

App adalah Laravel + Inertia + React Vite.

Akses method:
1. **IP/Subfolder**: `http://{IP}/{SUBFOLDER}` — Apache Alias `/SUBFOLDER` → `{PATH_PROJECT}/public`
2. **Domain/Root**: `http://{DOMAIN}/` — DocumentRoot → `{PATH_PROJECT}/public`

Env: `APP_URL=http://{IP}/{SUBFOLDER}`, `VITE_BASE_PATH=/{SUBFOLDER}`

---

## Langkah-Langkah

### 1. Identifikasi Semua URL Hardcoded di Frontend

Cari semua string yang merupakan path absolut dari root (`/...`):

```bash
# Di folder resources/js, cari pola yang menandakan URL hardcoded:
# - string yang dimulai dengan '/' (path absolut)
# - digunakan sebagai: href, src, fetch(), router.visit(), router.post(), <Link>, navigate(), dll.
```

Pola yang harus dicari:
- `fetch('/...')` dan `fetch("/...)`
- `router.post('/...')` dan `router.visit('/...')`
- `<Link href="/...">` (Inertia Link)
- `href="/..."` pada `<a>`
- `src="/..."` pada `<img>`
- `new URL('/...', import.meta.url)` — ini Vite transform, cari alternatif
- Navigasi React Router: `navigate('/...')`

**KATEGORI URL yang perlu baseUrl():**
- API calls: `fetch('/api/...')`
- Form submit: `router.post('/form/...')`
- Admin/petugas routes: `router.visit('/admin/...')`, `router.post('/petugas/...')`
- Download links: `href="/admin/.../export"`
- Image/PDF src: `src={item.image_url}`, `href={doc.pdf_url}`
- Inertia `<Link>` href

**KATEGORI yang TIDAK perlu diubah:**
- URL tujuan redirect di form `_redirect` — ini string signal untuk controller, bukan URL sebenarnya
- Path di `<Route path="/...">` React Router — ini path pattern, bukan URL absolut
- `baseUrl()` function itu sendiri

### 2. Buat Helper `baseUrl()`

Di `resources/js/lib/path.ts`:

```ts
export function baseUrl(path: string): string {
    const base = import.meta.env.VITE_BASE_PATH || '';
    return `${base}${path}`;
}
```

### 3. Bungkus Semua URL Hardcoded dengan `baseUrl()`

Untuk setiap file yang punya URL absolut, bungkus dengan `baseUrl()`:

```ts
// SEBELUM
router.post('/admin/berita', data);

// SESUDAH
router.post(baseUrl('/admin/berita'), data);
```

Pengecualian:
- Inertia `<Link href>` — TETAP pakai `baseUrl()`
- React Router `navigate()` — JANGAN pakai `baseUrl()` karena BrowserRouter basename sudah otomatis prepend
- `<Route path>` — path pattern, bukan URL nyata

### 4. Backend: Ubah `redirect('/')` ke Route Name

Cari semua `redirect('/..')` atau `redirect()->to('/...')` di controller PHP dan ganti dengan `redirect()->route('nama.route')`.

```php
// SEBELUM
return redirect('/');

// SESUDAH
return redirect()->route('dashboard');
```

Ini penting karena route name akan generate URL sesuai `APP_URL` yang sudah include subfolder.

### 5. Environment

Di `.env`:
```
APP_URL=http://{IP}/{SUBFOLDER}
SESSION_PATH=/           # penting: biar cookie session work di root dan subfolder
SESSION_DOMAIN=null
VITE_BASE_PATH=/{SUBFOLDER}
```

### 6. PDF Worker (jika pakai react-pdf)

Source code:
```ts
import { pdfjs } from 'react-pdf';

// CARA LAMA (GAGAL di subfolder):
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();
// Vite transform ini jadi absolute path /assets/... yang IGNORE base path

// CARA BARU:
// 1. Copy worker ke public/:
//    cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.mjs
// 2. Refer pakai baseUrl:
import { baseUrl } from '@/lib/path';
pdfjs.GlobalWorkerOptions.workerSrc = baseUrl('/pdf.worker.min.mjs');
```

### 7. Apache VHost

Buat file vhost dengan Alias:
```apache
<VirtualHost *:80>
    ServerName {IP}
    DocumentRoot "C:/laragon/www"

    Alias /{SUBFOLDER} "{PATH_PROJECT}/public"
    <Directory "{PATH_PROJECT}/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 8. `.htaccess` — Subfolder Rewrite Rule

Di `public/.htaccess`, tambahkan rule khusus SEBELUM Front Controller:

```apache
# Subfolder Alias fix: rewrite absolute supaya Apache pakai Alias bukan document_root
RewriteCond %{REQUEST_URI} ^/{SUBFOLDER}/
RewriteCond %{ENV:REDIRECT_STATUS} ^$
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ /{SUBFOLDER}/index.php [L]

# Send Requests To Front Controller (default Laravel)
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]
```

**Kenapa perlu:** Rule default `RewriteRule ^ index.php [L]` pakai path relatif. Apache resolve relatif dari `document_root`, bukan dari `Alias`. Untuk subfolder, kita perlu path absolut `/SUBFOLDER/index.php` supaya Apache pakai Alias path.

### 9. Storage Link

```bash
php artisan storage:link
```

### 10. Build & Cache

```bash
npm run build
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

---

## Checklist Verifikasi

Setelah selesai, test dari browser:

- [ ] `http://{IP}/{SUBFOLDER}/` → halaman utama (atau login) muncul, tidak 404/500
- [ ] `http://{IP}/{SUBFOLDER}/login` → form login muncul, CSS/JS tidak 404
- [ ] Semua halaman React Router (pengertian, struktur, sop, peraturan) bisa diakses
- [ ] Halaman admin (dashboard, berita, akun, poster, dll) bisa diakses
- [ ] Form submit bekerja (tidak 404, tidak page expired 419)
- [ ] Gambar berita/poster muncul (src pakai baseUrl)
- [ ] PDF viewer muncul (worker tidak 404)
- [ ] Download file (export, pdf) bekerja
- [ ] Domain access `http://{DOMAIN}/` juga masih jalan (jika ada)
- [ ] Console browser: tidak ada error 404 untuk asset apa pun
- [ ] PHP log: `storage/logs/laravel.log` tidak ada error baru

---

## Contoh Kode Helper

```ts
// resources/js/lib/path.ts
export function baseUrl(path: string): string {
    const base = import.meta.env.VITE_BASE_PATH || '';
    return `${base}${path}`;
}
```

---

## Troubleshooting

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| 404 di semua route | .htaccess rewrite rule belum ditambah | Tambahkan Subfolder Alias fix rewrite |
| 419 Page Expired | Session cookie wrong path | Set SESSION_PATH=/ di .env |
| PDF blank/worker 404 | new URL() transform | Copy worker ke public/, pakai baseUrl() |
| Gambar tidak muncul | image_url dari API tanpa prefix | Bungkus dengan baseUrl() |
| Aset JS/CSS 404 | Vite base path tidak sesuai | Pastikan VITE_BASE_PATH benar, build ulang |
