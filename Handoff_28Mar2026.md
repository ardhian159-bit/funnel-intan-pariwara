# HANDOFF — Intan Pariwara Sales Management System
## Lanjutan development session — 28 Maret 2026

---

## SISTEM OVERVIEW

**Nama Sistem:** National Sales Management System (NSMS)  
**Client:** PT Piwulang Pradnya Luhur (NSM KLDI - Intan Pariwara)

**Stack:** Vanilla HTML + Tailwind CSS + Chart.js + htmx | Backend: Google Apps Script | DB: Google Sheets | Hosting: GitHub Pages

**URLs:**
- Admin: `https://ardhian159-bit.github.io/funnel-intan-pariwara/prototype.html`
- Sales: `https://ardhian159-bit.github.io/funnel-intan-pariwara/sales.html`
- Apps Script: `https://script.google.com/macros/s/AKfycbxchhQHWthWjnmffOMGgDt1ShO3-D-T0XXOmpGNvP6jhgmtdCQZ5hiXcyymixjCRZOxNA/exec`
- Token: `IPFUNNEL2026` | Sheet ID: `1pRr17d546bcTTZEzB4MGfb70Hr4xO-JvUKgEINYu3XQ`
- Repo: `https://github.com/ardhian159-bit/funnel-intan-pariwara` | Local: `d:/IP/`

---

## STATUS SYSTEM (7 Stage) — SUDAH DIRENAME

| Status | TK (%) |
|--------|--------|
| Gagal | 0 |
| Informasi Awal | 5 |
| Informasi Kebutuhan | 10 |
| Presentasi | 25 |
| Peluang 50:50 | 50 |
| Hot Prospek | 75 |
| Closing | 100 |

---

## FILE STRUKTUR

```
repo/
├── prototype.html       ← Admin portal (belum direname ke admin.html)
├── dashboard.html       ← Dashboard analytics
├── sales.html           ← Sales portal
├── navbar.html          ← Shared navbar via htmx
├── Code.gs              ← Google Apps Script backend
└── assets/
    ├── region-data.js   ✅
    ├── api.js           ✅
    ├── auth.js          ✅
    └── utils.js         ✅
```

---

## BUGS FIXED SESI KEMARIN (27 Mar)

**`sales.html`:**
- History table field name mismatch → fix `u.statusBaru`, `u.forecastNetto`
- Status badge card tidak update setelah submit → fix update `funnelData` lokal + `renderProjectList()`
- Forecast submit ke sheet jadi 0 → fix parsing `replace(/\./g,'')` + `parseInt`
- History section hilang dari DOM → restored
- History tidak auto-load → tambah `populateHistoryFilters()` + `renderHistoryTable()` di `init()`
- Funnel chart baca dari `p.tk` → ganti ke `p.status`
- Warna chart dan rekap per stage diseragamkan

**`Code.gs`:**
- `updateTracker` return error saat duplikat → fix jadi overwrite
- Status LEADS tidak sync → tambah `updateLeadStatus()`
- TK LEADS tidak sync → tambah `tkMap` di `updateLeadStatus()`

**`prototype.html`:**
- Login modal tidak muncul saat buka tanpa session → tambah guard di `init()`
- Tambah fungsi `openLoginModal`, `closeLoginModal`, `handleLogin`, `logout`
- Status dropdown monitoring masih nama lama → fix ke nama baru

**`utils.js`:**
- `getStatusBadgeClass` dan `getStatusRowClass` → update ke nama status baru

---

## KNOWN ISSUES / YANG BELUM SELESAI

1. **Tombol X dan Batal di login modal `prototype.html`** — masih bisa bypass modal tanpa login. Perlu dihapus.
2. **Rename `prototype.html` → `admin.html`** — belum dikerjakan. File yang perlu update referensinya: `auth.js`, `navbar.html`, `sales.html`, `dashboard.html`
3. **Step 9: Offline CDN libs** — download Tailwind, Chart.js, chartjs-plugin-datalabels, htmx ke `assets/libs/`
4. **`dashboard.html`** — belum ada auth guard
5. **Referensi `Deal`** di `prototype.html` baris 3073, 3096, 3113 — masih pakai nama lama di dashboard/chart section

---

## ROADMAP STATUS

| Step | Task | Status |
|------|------|--------|
| 1 | `assets/region-data.js` | ✅ |
| 2 | `assets/api.js` | ✅ |
| 3 | `assets/auth.js` | ✅ |
| 4 | `assets/utils.js` | ✅ |
| 5 | `navbar.html` via htmx | ✅ |
| 6 | Hapus dashboard hardcode di prototype | ✅ |
| 7 | `sales.html` | ✅ |
| 8.1–8.4 | Backend filter, SHA-256, User Management | ✅ |
| 8.5 | Rename `prototype.html` → `admin.html` | ⏳ |
| 9 | Offline libs ke `assets/libs/` | ⏳ |

---

## PRINSIP DEVELOPMENT

- **Surgical edits** — hindari broad rewrite
- **Workflow:** Claude chat analisa → tulis surgical prompt → jalankan di Claude Code → verifikasi hasil
- **API:** semua GET (POST diblok CORS GitHub Pages)
- **Deploy Apps Script:** Terapkan → Kelola deployment → edit existing → Versi baru → Deploy
- **Test:** via Live Server, bukan `file://`
- **Model:** Sonnet untuk well-scoped surgical tasks
- **Hati-hati Claude Code** — sering bikin collateral damage saat edit HTML, selalu verifikasi file setelah edit
- **Field names TRACKER:** `statusBaru` dan `forecastNetto` — jangan pakai `status` atau `forecast`
