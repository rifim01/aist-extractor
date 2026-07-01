# ⚡ QUICK SETUP (5 menit)

## STEP 1: Download Files
Copy semua files dari output ke folder baru:
```
aist-data-extractor/
```

---

## STEP 2: Install Dependencies
```bash
cd aist-data-extractor
npm install
```
Tunggu 2-3 menit (download packages)

---

## STEP 3: Test Locally
```bash
npm start
```
Browser buka http://localhost:3000 otomatis

**Test:**
- Upload 1 screenshot
- Click "Start OCR"
- Tunggu hasil
- Coba export CSV

Tekan `Ctrl+C` untuk stop

---

## STEP 4: Push ke GitHub
```bash
git init
git add .
git commit -m "Initial: AIST Data Extractor"
git branch -M main
git remote add origin https://github.com/rifim01/aist-data-extractor.git
git push -u origin main
```

---

## STEP 5: Deploy ke Vercel
Go to https://vercel.com → Import Project → Select GitHub repo → Deploy

**Live dalam 1-2 menit di:** https://aist-data-extractor.vercel.app

---

## DONE! ✅

Live PWA siap pakai. Setiap `git push` auto-deploy otomatis.

---

## Next Steps

1. **Test dengan real AIST data**
2. **(Optional) Setup Google Sheets API** (lihat SETUP_GITHUB_VERCEL.md)
3. **Train staff pakai PWA** (lihat CARA_PAKAI.md)
4. **Monitor & update** (git push untuk changes)

---

## Troubleshooting Install

**Error: npm not found?**
→ Install Node.js dari https://nodejs.org (LTS version)

**Error: Permission denied?**
→ `sudo npm install` atau use nvm

**Error: Port 3000 in use?**
→ `npm start -- --port 3001`

**Error: Git not found?**
→ Install Git dari https://git-scm.com

---

**Questions?** Contact Bobby

---

## Commands Reference

```bash
npm start              # Local dev
npm run build          # Production build
npm install            # Install deps
git status             # Check changes
git push               # Push to GitHub
git pull               # Pull from GitHub
```

---

**Estimated time:** 5 min (install) + 2 min (GitHub) + 2 min (Vercel) = 9 min total
