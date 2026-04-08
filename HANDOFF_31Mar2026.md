# HANDOFF — Intan Pariwara Sales Management System
## Sesi 30–31 Maret 2026

---

## SISTEM OVERVIEW

**Nama Sistem:** National Sales Management System (NSMS)
**Client:** PT Piwulang Pradnya Luhur (NSM KLDI - Intan Pariwara)

**Stack:** Vanilla HTML + Tailwind CSS + Chart.js + htmx | Backend: Google Apps Script | DB: Google Sheets | Hosting: GitHub Pages

**URLs:**
- Admin: `https://ardhian159-bit.github.io/funnel-intan-pariwara/admin.html`
- Sales: `https://ardhian159-bit.github.io/funnel-intan-pariwara/sales.html`
- Monitoring: `https://ardhian159-bit.github.io/funnel-intan-pariwara/monitoring.html`
- Control Panel: `https://ardhian159-bit.github.io/funnel-intan-pariwara/controlpanel.html`
- Dashboard: `https://ardhian159-bit.github.io/funnel-intan-pariwara/dashboard.html`
- Apps Script: `https://script.google.com/macros/s/AKfycbxchhQHWthWjnmffOMGgDt1ShO3-D-T0XXOmpGNvP6jhgmtdCQZ5hiXcyymixjCRZOxNA/exec`
- Token: `IPFUNNEL2026` | Sheet ID: `1pRr17d546bcTTZEzB4MGfb70Hr4xO-JvUKgEINYu3XQ`
- Repo: `https://github.com/ardhian159-bit/funnel-intan-pariwara`
- Local: `d:/IP/` (Git repo) · `d:/IP 2/` (Hugo workspace)

---

## FILE STRUKTUR

```
repo/
├── index.html              ← BELUM ADA (todo: redirect ke sales.html)
├── admin.html              ← Admin portal (Input + Update Funnel)
├── monitoring.html         ← Monitoring Weekly standalone ✅
├── controlpanel.html       ← Control Panel standalone ✅
├── dashboard.html          ← Dashboard analytics
├── sales.html              ← Sales portal
├── navbar.html             ← Shared navbar via htmx
├── Code.gs                 ← Google Apps Script backend
└── assets/
    ├── api.js              ✅
    ├── auth.js             ✅
    ├── utils.js            ✅
    └── region-data.js      ✅
```

---

## YANG DIKERJAKAN SESI INI

### MPA Architecture
- ✅ `monitoring.html` dipisah dari `admin.html` — standalone, session guard, diet dari 129KB → 68KB
- ✅ `controlpanel.html` dipisah dari `admin.html` — standalone, session guard, diet dari 123KB → 71KB
- ✅ `prototype.html` rename ke `admin.html` — semua referensi diupdate
- ✅ Navbar MPA routing — tombol Monitoring → `monitoring.html`, Control Panel → `controlpanel.html`

### Admin Input Funnel Remodel
- ✅ UI Input Funnel admin diremodel mengikuti `sales.html` — field `fi-*`, layout 2 kolom
- ✅ Dropdown PIC dinamis dari `picNames` (tidak hardcoded)
- ✅ Auto-calculate Forecast Netto dari Brutto + PPN + CB
- ✅ Status auto-set dari TK via `onTKChange()`
- ✅ Field mapping fix ke backend: `namaPaket`, `sumberDana`, `jenisProduk`, `ppnNon`, `perkiraanCb`, `dpp`

### generateFunnelId Fix
- ✅ Skema baru: 3 huruf nama depan, extend ke 4 jika collision (GIR-0001, DSB-0001, dll)
- ✅ Fix di `utils.js` (frontend) dan `Code.gs` (backend auto-generate saat `addLead`)
- ✅ Backfill funnelId kosong via `backfillFunnelIds()` di Apps Script

### Monitoring Improvements
- ✅ Modal detail per row — klik row → popup dengan semua field
- ✅ Admin Notes editable dari modal + save ke TRACKER sheet
- ✅ Fix bug overwrite `updateTracker` — kolom adminNotes (I) tidak ikut diupdate, sekarang sudah fix
- ✅ Export CSV di-hide (bisa ditampilkan kembali jika butuh)
- ✅ Filter bug fix — `getVisibleUpdates()` tidak perlu `currentSalesUser === 'ALL'`

### Dashboard
- ✅ KPI panel Brutto — tambah info loss dari project Gagal (TK=0) dengan diff merah

### Sales
- ✅ Kolom WEEK INPUT di tabel Pipeline — konversi timestamp leads ke format W13-2026

### Bug Fixes
- ✅ `fillSelect` hilang di `controlpanel.html` setelah diet — ditambahkan kembali
- ✅ Footer literal `\n` di beberapa file — dibersihkan
- ✅ `today` hardcoded `new Date(2026, 2, 7)` di `monitoring.html` — fix ke `new Date()`
- ✅ `adminNotes` tidak tersimpan saat overwrite TRACKER — fix kolom 9 di `updateTracker()`

---

## KNOWN ISSUES / YANG BELUM SELESAI

| # | Issue | File | Prioritas |
|---|-------|------|-----------|
| 1 | Auth guard belum ada | `dashboard.html` | Medium |
| 2 | CSS badge class lama (`badge-deal`, `badge-pitching`, dll) masih dipakai di `utils.js` | `utils.js` | Medium |
| 3 | Duplikasi header komentar | `api.js` | Low |
| 4 | Tab Update Funnel di `admin.html` perlu di-hide | `admin.html` | Low |
| 5 | `index.html` redirect ke `sales.html` belum dibuat | - | Low |
| 6 | Step 9: Offline CDN libs ke `assets/libs/` | semua HTML | Low |

---

## FIELD MISMATCH — RECURRING TRAP

Ini daftar mismatch yang sudah pernah menyebabkan bug:

### Frontend → Backend (addLead / updateTracker)

| ❌ Salah | ✅ Benar | Konteks |
|----------|----------|---------|
| `namapaket` | `namaPaket` | addLead payload |
| `sumberdana` | `sumberDana` | addLead payload |
| `jenisproduk` | `jenisProduk` | addLead payload |
| `ppn` | `ppnNon` | addLead payload |
| `cb` | `perkiraanCb` | addLead payload |
| `forecast` | `forecastNetto` | updateTracker payload |
| `status` | `statusBaru` | updateTracker payload |
| `SESSION` | `ip_session` | sessionStorage key |

### Backend → Frontend (getTrackers mapping)

| Sheet Column | Field Name | Index |
|---|---|---|
| A | id | 0 |
| B | funnelId | 1 |
| C | pic | 2 |
| D | namaPaket | 3 |
| E | statusBaru | 4 |
| F | forecastNetto | 5 |
| G | notes | 6 |
| H | week | 7 |
| I | adminNotes | 8 |
| J | timestamp | 9 |

### Backend → Frontend (getLeads mapping)

| Sheet Column | Field Name | Index |
|---|---|---|
| A | id/no | 0 |
| B | funnelId | 1 |
| C | principal | 2 |
| D | status | 3 |
| E | pic | 4 |
| F | instansi | 5 |
| G | wilayah | 6 |
| H | kabupatenKota | 7 |
| I | provinsi | 8 |
| J | namaPaket | 9 |
| K | sumberDana | 10 |
| L | nilaiAnggaran | 11 |
| M | dpp | 12 |
| N | forecastNetto | 13 |
| O | ppnNon | 14 |
| P | perkiraanCb | 15 |
| Q | produk | 16 |
| R | qty | 17 |
| S | satuan | 18 |
| T | jenisProduk | 19 |
| U | tk | 20 |
| V | quarter | 21 |
| W | timestamp | 22 |
| X | keterangan | 23 |

---

## PRINSIP DEVELOPMENT

- **Surgical edits** — hindari broad rewrite, selalu audit dulu sebelum prompt
- **Workflow:** Claude chat analisa + audit file → tulis surgical prompt → Hugo/Claude Code eksekusi → verifikasi
- **Hugo workspace:** `d:/IP 2/` → copy ke `d:/IP/` via `Copy-Item` sebelum push
- **Claude Code:** bisa kerja langsung di `d:/IP/` tanpa perlu Copy-Item
- **API:** semua GET (POST diblok CORS GitHub Pages), semua via `apiPost` yang sebenarnya GET dengan payload di query string
- **Session key:** `ip_session` (bukan `SESSION` — itu variable JS di sales.html)
- **Hash:** SHA-256 di frontend, backend hanya compare string
- **Deploy Apps Script:** Terapkan → Kelola deployment → edit existing → Versi baru → Deploy
- **Test:** via Live Server, bukan `file://`
- **Field TRACKER:** `statusBaru` dan `forecastNetto` (bukan `status`/`forecast`)
- **Double-hash trap:** Frontend sudah hash, backend JANGAN re-hash
- **LF/CRLF warning saat push** — normal di Windows, abaikan
