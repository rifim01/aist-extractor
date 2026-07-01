# 🔴 AIST Data Extractor

PWA untuk ekstraksi data AIST (screenshot OCR) → CSV/Google Sheets untuk PT. Rifim International Gemilang

**Live:** https://aist-data-extractor.vercel.app

---

## 📋 FITUR

✅ **Upload Multiple Screenshots** — Drag & drop atau click select (max 10 files)  
✅ **OCR Processing** — Tesseract.js ekstraksi teks real-time, client-side  
✅ **Data Validation** — Auto-check format tanggal, sum (45k/95k/145k/195k), account  
✅ **Manual Edit** — Ubah/hapus data error sebelum export  
✅ **3 Export Options:**
  - CSV download (import di mana saja)
  - Copy to clipboard (paste ke Google Sheet)
  - Direct append Google Sheets API (otomatis)

---

## 🚀 QUICK START

### 1. Clone & Install
```bash
git clone https://github.com/rifim01/aist-data-extractor
cd aist-data-extractor
npm install
```

### 2. Local Development
```bash
npm start
```
Buka http://localhost:3000

### 3. Build & Deploy
```bash
npm run build
```
Vercel auto-deploy dari GitHub (tinggal push)

---

## 📊 WORKFLOW

```
1. Upload AIST screenshots (8-10 per batch)
   ↓
2. Tesseract OCR proses (progress bar, client-side)
   ↓
3. Auto-deduplicate & validate
   ↓
4. Review data, edit errors
   ↓
5. Export: CSV / Clipboard / Google Sheets
   ↓
6. Paste to INPUT_DOCK → Run "Proses Transaksi"
```

---

## 🔧 CONFIG

### Google Sheets API (Optional)
Untuk append otomatis ke Google Sheet, butuh:

1. **API Key** dari Google Cloud Console
2. **Spreadsheet ID** dari URL
3. Set di `ExportStep.jsx` baris 40-45:

```javascript
const apiKey = 'YOUR_API_KEY';
const spreadsheetId = 'YOUR_SPREADSHEET_ID';
const range = 'INPUT_DOCK_1!A4';
```

### Data Format (OCR Parsing)

Ekstraksi 3 kolom dari AIST:

| Kolom | Format | Contoh |
|-------|--------|--------|
| Date | DD.MM.YYYY HH:MM:SS | 01.07.2026 22:37:10 |
| Sum | Numeric (space-separated) | 45 000 |
| Account | String | 214220391: Dedi Simanungkalit |

**Valid Sum Values:** 45000, 95000, 145000, 195000

---

## 📁 PROJECT STRUCTURE

```
aist-data-extractor/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── UploadStep.jsx
│   │   ├── ProcessingStep.jsx
│   │   ├── PreviewStep.jsx
│   │   └── ExportStep.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.jsx
│   └── index.css
├── package.json
├── vercel.json
└── README.md
```

---

## 🛠️ TECH STACK

- **React 18** — UI framework
- **Tesseract.js** — Client-side OCR
- **PapaParse** — CSV handling
- **Tailwind CSS** — Styling
- **Vercel** — Deployment & hosting

---

## ⚡ TROUBLESHOOTING

**Q: OCR tidak akurat?**  
A: Coba screenshot yang lebih jelas (good lighting), atau manual edit di preview

**Q: Google Sheets append gagal?**  
A: Check API key & spreadsheet ID, pastikan "Anyone with link" di Share settings

**Q: Data duplikat?**  
A: Auto-deduplicate bekerja di background, check preview

---

## 📝 USAGE NOTES

- **No data stored** — All processing client-side, nothing saved to server
- **Offline-ready** — Works tanpa internet (OCR & CSV)
- **Mobile-friendly** — Responsive design, works di tablet/phone
- **Fast** — ~2-3 sec per screenshot, batch 8 files ~15-20 sec total

---

## 🔐 PRIVACY

✅ Semua data diproses di browser user  
✅ Tidak ada data yang tersimpan di server  
✅ Screenshots tidak di-upload atau disimpan  
✅ Google Sheets API append hanya ke spreadsheet yang di-auth

---

## 📞 SUPPORT

Issues? Contact Bobby di Batam.

---

## 📜 LICENSE

Internal use only - PT. Rifim International Gemilang

---

## 🚀 DEPLOYMENT

**Automated:** Push ke GitHub → Vercel auto-builds & deploys

```bash
git add .
git commit -m "feat: add feature"
git push origin main
```

Live update di https://aist-data-extractor.vercel.app dalam 1-2 menit

---

**Version:** 1.0.0  
**Last Updated:** July 2026  
**Status:** ✅ Production-Ready
