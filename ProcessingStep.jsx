import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';

function ProcessingStep({ files, onProcessing, loading }) {
  const [progress, setProgress]     = useState([]);
  const [statusText, setStatusText] = useState('');
  const [debugLog, setDebugLog]     = useState([]);

  // ── Re-run setiap kali loading berubah ke true ───────────────────────────
  useEffect(() => {
    if (!loading || !files || files.length === 0) return;
    setProgress(files.map(() => 0));
    setDebugLog([]);
    processFiles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // ── MAIN PROCESS: tunggu SEMUA file selesai OCR ──────────────────────────
  const processFiles = async () => {
    setStatusText(`Memulai OCR untuk ${files.length} file...`);
    const allRows = [];
    const prog    = files.map(() => 0);
    const logs    = [];

    // Buat satu Promise per file, tunggu semua selesai (Promise.all)
    const promises = Array.from(files).map((file, i) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            setStatusText(`OCR file ${i + 1}/${files.length}: ${file.name}`);

            const result = await Tesseract.recognize(e.target.result, 'eng', {
              logger: (m) => {
                if (m.status === 'recognizing') {
                  prog[i] = Math.floor(m.progress * 100);
                  setProgress([...prog]);
                }
              },
            });

            const rawText = result.data.text;
            logs.push(`\n── File ${i + 1}: ${file.name} ──\n${rawText.substring(0, 500)}`);

            const rows = parseOCRText(rawText);
            logs.push(`  → ${rows.length} baris ditemukan`);
            prog[i] = 100;
            setProgress([...prog]);
            resolve(rows);

          } catch (err) {
            logs.push(`❌ Error file ${i + 1}: ${err.message}`);
            resolve([]);
          }
        };
        reader.onerror = () => resolve([]);
        reader.readAsDataURL(file);
      })
    );

    // Tunggu SEMUA selesai
    const results = await Promise.all(promises);
    results.forEach(rows => allRows.push(...rows));
    setDebugLog(logs);

    const cleaned = deduplicateRows(allRows);
    setStatusText(`✅ Selesai! Ditemukan ${cleaned.length} baris unik dari ${allRows.length} total.`);
    onProcessing(cleaned);
  };

  // ── PARSER: fleksibel untuk berbagai output OCR ──────────────────────────
  const parseOCRText = (rawText) => {
    const rows = [];

    // Normalisasi OCR artifacts sebelum parsing
    const text = rawText
      .replace(/[|]/g, '')          // hapus | dari OCR
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);

    for (const line of lines) {
      const row = tryParseLine(line);
      if (row) rows.push(row);
    }

    return rows;
  };

  const tryParseLine = (line) => {
    // ── Pattern 1: Format asli AIST ─────────────────────────────────
    // "01.07.2026 22:37:10   95 000   214220391: Dedi Simanungkalit"
    let m = line.match(
      /(\d{2}[.,]\d{2}[.,]\d{4})\s+(\d{2}[:.]\d{2}[:.]\d{2})\s+(\d[\d\s.,]+\d)\s+(\d{6,}.*)/
    );
    if (m) {
      const sum = normalizeSum(m[3]);
      if (isValidSum(sum)) {
        return {
          date: `${normDate(m[1])} ${normTime(m[2])}`,
          sum,
          account: m[4].trim(),
          errors: [],
        };
      }
    }

    // ── Pattern 2: Date dan time tanpa spasi pemisah antar kolom ────
    // "01.07.2026 22:37:10 95000 214220391: Dedi"
    m = line.match(
      /(\d{2}[.,]\d{2}[.,]\d{4})\s+(\d{2}[:.]\d{2}[:.]\d{2})\s+(\d{2,6})\s+(\d{6,}.*)/
    );
    if (m) {
      const sum = normalizeSum(m[3]);
      if (isValidSum(sum)) {
        return {
          date: `${normDate(m[1])} ${normTime(m[2])}`,
          sum,
          account: m[4].trim(),
          errors: [],
        };
      }
    }

    // ── Pattern 3: Tanggal saja (OCR gabungkan kolom) ────────────────
    // "01.07.2026 22:37:10 45 000 214220391: Dedi"
    m = line.match(
      /(\d{2}[.,]\d{2}[.,]\d{4}\s+\d{2}[:.]\d{2}[:.]\d{2})\s+(\d[\d\s.,]{2,8}\d)\s+(\d{6,}.*)/
    );
    if (m) {
      const sum = normalizeSum(m[2]);
      if (isValidSum(sum)) {
        return {
          date: normDateTime(m[1]),
          sum,
          account: m[3].trim(),
          errors: [],
        };
      }
    }

    return null;
  };

  // ── HELPERS ──────────────────────────────────────────────────────────────
  const normDate = (s) => s.replace(',', '.').replace(/\s/g, '');
  const normTime = (s) => s.replace(';', ':').replace(/\s/g, '');
  const normDateTime = (s) => {
    // "01.07.2026 22:37:10" → keep as-is, normalize separators
    return s.replace(',', '.').replace(';', ':').replace(/\s+/, ' ').trim();
  };

  const normalizeSum = (s) => {
    // "95 000" → "95000", "95,000" → "95000", "95.000" → "95000"
    return s.replace(/[\s,\.]/g, '');
  };

  const VALID_SUMS = new Set(['45000', '95000', '145000', '195000']);
  const isValidSum = (s) => VALID_SUMS.has(s);

  const deduplicateRows = (rows) => {
    const seen = new Set();
    return rows.filter(row => {
      const key = `${row.date}|${row.sum}|${row.account}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="step">
      <h2>⏳ Step 2: OCR Processing</h2>

      <div className="progress-container">
        {progress.map((p, i) => (
          <div key={i} className="progress-item">
            <div className="progress-label">
              {files[i]?.name || `File ${i + 1}`}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${p}%` }}>
                {p}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {statusText && (
        <p className="info" style={{ marginTop: 12, fontWeight: 500 }}>
          {statusText}
        </p>
      )}

      {/* Debug panel — tampil jika ada log */}
      {debugLog.length > 0 && (
        <details style={{ marginTop: 16, fontSize: 11, textAlign: 'left' }}>
          <summary style={{ cursor: 'pointer', color: '#666' }}>
            🔍 Debug OCR Log (klik untuk lihat)
          </summary>
          <pre style={{
            background: '#f5f5f5', padding: 8, borderRadius: 4,
            maxHeight: 200, overflow: 'auto', whiteSpace: 'pre-wrap',
            fontSize: 10, marginTop: 4,
          }}>
            {debugLog.join('\n')}
          </pre>
        </details>
      )}

      <p className="info" style={{ color: '#888', marginTop: 8 }}>
        Harap tunggu — OCR bisa memakan waktu 20-60 detik per file...
      </p>
    </div>
  );
}

export default ProcessingStep;
