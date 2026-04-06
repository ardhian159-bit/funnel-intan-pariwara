# NSMS — National Sales Management System
# PT Piwulang Pradnya Luhur (NSM KLDI - Intan Pariwara)
# CLAUDE.md — drop this at d:/IP/CLAUDE.md

---

## Stack & Hosting

- Frontend: Vanilla HTML + Tailwind CSS + Chart.js + htmx
- Backend: Google Apps Script (Code.gs)
- DB: Google Sheets (Sheet ID: `1pRr17d546bcTTZEzB4MGfb70Hr4xO-JvUKgEINYu3XQ`)
- Hosting: GitHub Pages
- Auth token: `IPFUNNEL2026`
- Session key: `ip_session` (BUKAN `SESSION`)

---

## File Map

```
d:/IP/
├── admin.html          ← Admin portal (Input + Update Funnel)
├── sales.html          ← Sales portal
├── monitoring.html     ← Monitoring Weekly (standalone) ✅
├── controlpanel.html   ← Control Panel (standalone) ✅
├── dashboard.html      ← Dashboard analytics
├── navbar.html         ← Shared navbar via htmx
├── index.html          ← TODO: redirect ke sales.html (belum ada)
├── Code.gs             ← Google Apps Script backend
└── assets/
    ├── api.js          ✅
    ├── auth.js         ✅
    ├── utils.js        ✅
    └── region-data.js  ✅
```

---

## URLs

- Apps Script: `https://script.google.com/macros/s/AKfycbxchhQHWthWjnmffOMGgDt1ShO3-D-T0XXOmpGNvP6jhgmtdCQZ5hiXcyymixjCRZOxNA/exec`
- Admin: `https://ardhian159-bit.github.io/funnel-intan-pariwara/admin.html`
- Sales: `https://ardhian159-bit.github.io/funnel-intan-pariwara/sales.html`
- Monitoring: `https://ardhian159-bit.github.io/funnel-intan-pariwara/monitoring.html`
- Repo: `https://github.com/ardhian159-bit/funnel-intan-pariwara`

---

## Rules — WAJIB DIIKUTI

- **Surgical edits only** — jangan broad rewrite. Audit file dulu sebelum edit.
- **Jangan sentuh Apps Script URL** — hardcoded, kalau berubah semua request mati.
- **Jangan re-hash password di backend** — frontend sudah SHA-256, backend hanya compare string.
- **Semua request via GET** — POST diblok CORS GitHub Pages. Payload di query string via `apiPost`.
- **Session key adalah `ip_session`** — bukan `SESSION` (itu variable JS lokal di sales.html).
- **Test via Live Server** — bukan `file://`, karena htmx dan fetch butuh HTTP.
- **Deploy Apps Script:** Terapkan → Kelola deployment → edit existing → Versi baru → Deploy.
- **LF/CRLF warning saat push** — normal di Windows, abaikan.

---

## FIELD MISMATCH — JANGAN SAMPAI SALAH LAGI

### Frontend → Backend (addLead payload)

| ❌ Salah     | ✅ Benar      |
|-------------|--------------|
| `namapaket` | `namaPaket`  |
| `sumberdana`| `sumberDana` |
| `jenisproduk`| `jenisProduk`|
| `ppn`       | `ppnNon`     |
| `cb`        | `perkiraanCb`|

### Frontend → Backend (updateTracker payload)

| ❌ Salah   | ✅ Benar         |
|-----------|----------------|
| `forecast`| `forecastNetto` |
| `status`  | `statusBaru`    |

### Backend → Frontend (getTrackers — TRACKER sheet)

| Kolom | Field       | Index |
|-------|-------------|-------|
| A     | id          | 0     |
| B     | funnelId    | 1     |
| C     | pic         | 2     |
| D     | namaPaket   | 3     |
| E     | statusBaru  | 4     |
| F     | forecastNetto| 5    |
| G     | notes       | 6     |
| H     | week        | 7     |
| I     | adminNotes  | 8     |
| J     | timestamp   | 9     |

### Backend → Frontend (getLeads — LEADS sheet)

| Kolom | Field          | Index |
|-------|----------------|-------|
| A     | id/no          | 0     |
| B     | funnelId       | 1     |
| C     | principal      | 2     |
| D     | status         | 3     |
| E     | pic            | 4     |
| F     | instansi       | 5     |
| G     | wilayah        | 6     |
| H     | kabupatenKota  | 7     |
| I     | provinsi       | 8     |
| J     | namaPaket      | 9     |
| K     | sumberDana     | 10    |
| L     | nilaiAnggaran  | 11    |
| M     | dpp            | 12    |
| N     | forecastNetto  | 13    |
| O     | ppnNon         | 14    |
| P     | perkiraanCb    | 15    |
| Q     | produk         | 16    |
| R     | qty            | 17    |
| S     | satuan         | 18    |
| T     | jenisProduk    | 19    |
| U     | tk             | 20    |
| V     | quarter        | 21    |
| W     | timestamp      | 22    |
| X     | keterangan     | 23    |

---

## Known Issues (Backlog)

| # | Issue                                              | File             | Prioritas |
|---|----------------------------------------------------|------------------|-----------|
| 1 | Auth guard belum ada                               | dashboard.html   | Medium    |
| 2 | CSS badge class lama masih dipakai                 | utils.js         | Medium    |
| 3 | Tab Update Funnel perlu di-hide                    | admin.html       | Low       |
| 4 | index.html redirect ke sales.html belum dibuat     | —                | Low       |
| 5 | Offline CDN libs ke assets/libs/                   | semua HTML       | Low       |

---

## Compact Instructions

Saat summarize fokus ke:
- File yang diubah (nama file + apa yang berubah)
- Bug yang ditemukan dan cara fixnya
- Field mismatch baru yang ditemukan
- Status task terakhir dan stopping point-nya
Skip: penjelasan umum cara kerja sistem, kode yang hanya dibaca tanpa diubah.
