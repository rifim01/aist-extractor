# 📖 CARA PAKAI AIST Data Extractor

## ⚡ QUICK START (3 menit)

### 1. Buka PWA
```
https://aist-data-extractor.vercel.app
```

### 2. Upload Screenshot AIST
- Klik upload area atau drag-drop
- Pilih 8-10 screenshot sekaligus
- Klik "Start OCR Processing"

### 3. Tunggu Proses
- Tesseract OCR jalan otomatis
- Progress bar menunjuk status
- ~2-3 detik per screenshot

### 4. Review Data
- Lihat kolom: Date | Sum | Account
- Edit data yang error (klik "Edit")
- Hapus row yang gak perlu
- Validasi harus 100% sebelum export

### 5. Export
Pilih 1 dari 3 cara:

**A. Download CSV** → Import ke Excel/Google Sheet manual  
**B. Copy to Clipboard** → Paste langsung ke Google Sheet  
**C. Append Google Sheet** → Otomatis ke INPUT_DOCK_1

---

## 🎯 WORKFLOW HARIAN

**Pagi (08:00):** Screenshot AIST 200-300 rows  
**Input Excel:** Jalankan extractor (15-20 menit)  
**Review:** Check data di preview (5 menit)  
**Copy:** Paste ke Google Sheet INPUT_DOCK_1  
**Proses:** Click button "Proses Transaksi"  

---

## ✅ DATA VALIDATION

Sistem otomatis check:
- ✅ Format tanggal: `DD.MM.YYYY HH:MM:SS`
- ✅ Sum value: **45000**, **95000**, **145000**, **195000**
- ✅ Credit account: tidak boleh kosong

**Error?** Lihat di kolom "Status", klik "Edit" untuk fix

---

## 📋 KOLOM DATA

| Field | Format | Contoh |
|-------|--------|--------|
| **Date** | DD.MM.YYYY HH:MM:SS | 01.07.2026 22:37:10 |
| **Sum** | Numeric with space | 45 000 |
| **Account** | Text | 214220391: Dedi Simanungkalit |

---

## 🚀 EXPORT OPTIONS

### Option A: CSV Download
```
Kapan? Ketika mau simpan file lokal dulu
Hasil? File .csv siap import
Next? Buka di Excel, copy-paste ke Google Sheet
```

### Option B: Copy to Clipboard
```
Kapan? Paling cepat & praktis untuk Google Sheet
Hasil? Data di clipboard (tab-separated)
Next? Buka Google Sheet INPUT_DOCK_1 → Paste
```

### Option C: Direct Google Sheet API
```
Kapan? Setelah setup Google Sheets API
Hasil? Auto-append ke INPUT_DOCK_1 sheet
Syarat? API Key harus di-set dulu
Next? Data langsung masuk, tinggal proses
```

---

## ⚙️ SETUP GOOGLE SHEETS (OPTIONAL)

Jika mau Option C (auto-append), butuh:

### Step 1: Dapat API Key
1. Buka https://console.cloud.google.com
2. Buat project baru: "AIST Extractor"
3. Cari "Google Sheets API" → Enable
4. Go to Credentials → Create API Key
5. Copy key

### Step 2: Set di PWA
Hubungi Bobby untuk set API key di code

### Step 3: Done
Sekarang bisa "Append to Google Sheet" langsung

---

## 🐛 TROUBLESHOOTING

### "OCR accuracy jelek"
→ Screenshot harus clear, good lighting, crop table saja  
→ Kalau masih jelek, manual edit di preview

### "Data tidak cocok sum value"
→ Pilih hanya row dengan sum 45k/95k/145k/195k saat screenshot  
→ Row lain akan error, hapus dari preview

### "Copy clipboard tidak jalan"
→ Check browser permission (Allow clipboard)  
→ Coba reload halaman

### "Google Sheet append gagal"
→ Pastikan spreadsheet share "Anyone with link"  
→ Check API key di vercel environment vars  
→ Contact Bobby

---

## 📊 EXPECTED VOLUME

**Per batch:** 200-300 rows  
**Processing time:** 15-20 menit (8-10 screenshot)  
**Daily:** 2-3 batch = 600-900 rows/hari  

---

## 🔐 PRIVACY & SECURITY

✅ **Semua proses di browser** — tidak ada data upload ke server  
✅ **Screenshot tidak disimpan** — hanya ekstrak 3 kolom  
✅ **Tidak ada tracking** — clean code, open-source ready  

---

## 📞 SUPPORT

Ada error atau pertanyaan?  
→ Contact Bobby (Batam)

---

## 🎓 TIPS & TRICKS

1. **Batch processing:** Upload 8-10 screenshot sekaligus, lebih cepat
2. **Quality check:** Validasi sebelum export, pastikan 0 error
3. **Backup:** Download CSV dulu sebelum append ke Google Sheet
4. **Time saving:** Pakai Clipboard copy, paling praktis
5. **Automation:** Setup Google Sheets API untuk fully automated workflow

---

**Version:** 1.0.0  
**Status:** ✅ Siap pakai  
**Last Updated:** July 2026
