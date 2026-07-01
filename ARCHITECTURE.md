# 🏗️ Architecture Overview

## Tech Stack

```
Frontend: React 18 + JavaScript
OCR: Tesseract.js (client-side)
Data: PapaParse (CSV)
Styling: CSS (Tailwind-inspired)
Deploy: Vercel (auto-CI/CD from GitHub)
```

---

## Component Flow

```
App.jsx (State Management)
    ├── UploadStep.jsx
    │   └── File upload + validation
    │
    ├── ProcessingStep.jsx
    │   └── Tesseract OCR processing
    │       ├── Read image
    │       ├── Extract text
    │       ├── Parse to rows
    │       └── Deduplicate
    │
    ├── PreviewStep.jsx
    │   └── Data review + validation
    │       ├── Show table
    │       ├── Validate each row
    │       ├── Manual edit
    │       └── Delete errors
    │
    └── ExportStep.jsx
        └── Export options
            ├── CSV download
            ├── Copy to clipboard
            └── Google Sheets API append
```

---

## Data Flow

```
Upload Files (step 1)
    ↓
Convert to Data URL
    ↓
Tesseract OCR (step 2)
    ↓
Parse text → Extract 3 columns
    ↓
Deduplicate by key (date + sum + account)
    ↓
Validate format (step 3)
    ↓
User edit/review
    ↓
Export (step 4)
    ├── CSV blob download
    ├── Clipboard copy (tab-separated)
    └── Google Sheets API POST
```

---

## Key Functions

### ProcessingStep.jsx
```javascript
parseOCRText(text)
  → Regex match: date + sum + account
  → Return array of {date, sum, account, errors}

deduplicateRows(rows)
  → Create composite key: date|sum|account
  → Filter using Set
  → Return unique rows only
```

### PreviewStep.jsx
```javascript
validateRow(row)
  → Check date format DD.MM.YYYY HH:MM:SS
  → Check sum in [45000, 95000, 145000, 195000]
  → Check account non-empty
  → Return errors array
```

### ExportStep.jsx
```javascript
downloadCSV()
  → Convert rows to CSV object
  → Use PapaParse.unparse()
  → Create blob + download link

copyToClipboard()
  → Format: date\tsum\taccount (tab-separated)
  → navigator.clipboard.writeText()

appendToGoogleSheet()
  → POST to sheets.googleapis.com API
  → Range: INPUT_DOCK_1!A4
  → Append mode (not replace)
```

---

## File Structure

```
aist-data-extractor/
├── src/
│   ├── App.jsx                    (Main component, state)
│   ├── App.css                    (Styling, responsive)
│   ├── index.jsx                  (Entry point)
│   ├── index.css                  (Global styles)
│   └── components/
│       ├── UploadStep.jsx         (File upload UI)
│       ├── ProcessingStep.jsx     (OCR processing)
│       ├── PreviewStep.jsx        (Data validation)
│       └── ExportStep.jsx         (Export logic)
├── public/
│   └── index.html                 (Root HTML)
├── package.json                   (Dependencies)
├── vercel.json                    (Vercel config)
└── README.md                      (Documentation)
```

---

## State Management (in App.jsx)

```javascript
const [step, setStep] = useState(1);           // Current step (1-4)
const [files, setFiles] = useState([]);        // Uploaded files
const [extractedData, setExtractedData] = useState([]); // OCR output
const [loading, setLoading] = useState(false); // Processing flag
```

Each step updates state and moves to next step

---

## Key Constraints & Decisions

1. **Client-side only** → No backend needed, privacy-first
2. **Tesseract.js** → Works offline, slow first time (downloads model)
3. **Regex parsing** → Simple but robust for AIST format
4. **Deduplication** → Handles overlapping screenshot windows
5. **Manual override** → Users can fix OCR errors in preview
6. **Multiple export** → CSV (safe), Clipboard (fast), API (automated)

---

## Performance Considerations

- OCR first run: ~30 sec (downloads Tesseract model 60MB)
- Subsequent runs: ~3 sec per image (cached)
- Max 10 files per batch: balances speed vs processing
- No image storage: keeps memory low
- Pagination: N/A (max 300 rows manageable)

---

## API Integration (Google Sheets)

```javascript
POST https://sheets.googleapis.com/v4/spreadsheets/{id}/values/{range}:append
Headers: Authorization (if OAuth) or ?key={apiKey}
Body: { values: [[col1, col2, col3], [...]] }
Response: appendedRows count
```

**Note:** Current version uses simple API key. For production, recommend OAuth.

---

## Extensibility

Easy to add:
- ✅ Different sum values (edit VALID_SUMS array)
- ✅ Additional columns (update parseOCRText regex)
- ✅ Different data sources (add format parser)
- ✅ Email alerts (add email export step)
- ✅ Database storage (add backend microservice)

---

## Security Notes

- ✅ No sensitive data persisted
- ✅ All processing in browser
- ✅ API key should be environment variable
- ✅ No authentication required (public PWA)
- ✅ Google Sheets requires "Anyone with link" share

---

## Deployment Pipeline

```
Local: npm start → Dev server http://localhost:3000
Build: npm run build → Static /build folder
Push: git push origin main
Vercel: Auto-pulls, builds, deploys
Live: aist-data-extractor.vercel.app (1-2 min)
```

---

## Future Improvements

- [ ] Tesseract model pre-download (reduce first-run lag)
- [ ] Batch auto-deduplicate using server (larger datasets)
- [ ] Database logging (audit trail)
- [ ] Email export (daily summary)
- [ ] Admin dashboard (see all extractions)
- [ ] OAuth Google Sheets (security upgrade)

---

**Architecture v1.0 — Production-ready, fully client-side PWA**
