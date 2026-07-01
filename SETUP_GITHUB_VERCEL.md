# GitHub & Vercel Setup Guide

## 1️⃣ GitHub Repository Setup

### Step 1: Create GitHub Repo
1. Go to https://github.com/new
2. **Repository name:** `aist-data-extractor`
3. **Public** (recommended)
4. Initialize with README? **No** (we have one)
5. Click "Create Repository"

### Step 2: Local Git Setup
```bash
cd aist-data-extractor
git init
git add .
git commit -m "Initial commit: AIST Data Extractor PWA"
git branch -M main
git remote add origin https://github.com/rifim01/aist-data-extractor.git
git push -u origin main
```

---

## 2️⃣ Vercel Deployment

### Option A: Easy (Recommended)
1. Go to https://vercel.com
2. Login with GitHub (or create free account)
3. Click **"Import Project"**
4. Select `rifim01/aist-data-extractor`
5. Click **"Import"**
6. Keep defaults, click **"Deploy"**
7. **Done!** Live in 1-2 minutes

**URL:** `aist-data-extractor.vercel.app` (auto-generated)

### Option B: Custom Domain
1. After deploy, go to **Settings** → **Domains**
2. Add custom domain (requires DNS config)
3. Recommended: Use vercel.app default

### Auto-Deploy on Push
✅ Already enabled! Every `git push` → auto-rebuild & deploy

---

## 3️⃣ Google Sheets API (Optional)

Only needed if you want direct append to Google Sheet.

### Step 1: Create API Key
1. Go to https://console.cloud.google.com
2. Create new project: "AIST Extractor"
3. Search "Google Sheets API" → Enable
4. Search "Cloud Console" → Go to credentials
5. Create API key (Restrict to Google Sheets API)
6. Copy the key

### Step 2: Set in Code
File: `src/components/ExportStep.jsx`, line 42:
```javascript
const apiKey = 'YOUR_GOOGLE_SHEETS_API_KEY';
```

Replace `YOUR_GOOGLE_SHEETS_API_KEY` with actual key

### Step 3: Secure in Vercel
1. Go to Vercel Project → **Settings**
2. Go to **Environment Variables**
3. Add: `REACT_APP_GOOGLE_SHEETS_API_KEY` = your API key
4. Redeploy

---

## 🎯 SUMMARY

```
✅ Files prepared
✅ GitHub repo created & pushed
✅ Vercel deployed (auto-live)
✅ Google Sheets API optional

→ Live at: aist-data-extractor.vercel.app
→ Auto-updates on git push
```

---

## 📋 CHECKLIST

- [ ] GitHub repo created
- [ ] Files pushed to GitHub
- [ ] Vercel deployment connected
- [ ] Live URL working
- [ ] Google Sheets API setup (if needed)

---

## 🔍 VERIFY DEPLOYMENT

```bash
# Check GitHub
git remote -v

# Check Vercel (wait 2 min after push, then visit)
https://aist-data-extractor.vercel.app
```

---

**Done!** PWA live & ready to use.
