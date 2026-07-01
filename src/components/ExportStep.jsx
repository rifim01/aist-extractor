import React, { useState } from 'react';
import Papa from 'papaparse';

function ExportStep({ data, onReset }) {
  const [exported, setExported] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // ─── EXPORT 1: Download CSV ───────────────────────────────────────────────
  const downloadCSV = () => {
    const csvData = data.map(row => ({
      Date: row.date,
      Sum: row.sum,
      'Credit Account': row.account,
    }));

    const csv  = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url  = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `AIST_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(true);
    setStatusMsg(`✅ CSV berhasil di-download (${data.length} baris)`);
  };

  // ─── EXPORT 2: Copy to Clipboard ─────────────────────────────────────────
  const copyToClipboard = () => {
    const text = data
      .map(row => `${row.date}\t${row.sum}\t${row.account}`)
      .join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setExported(true);
      setStatusMsg(`✅ ${data.length} baris di-copy! Paste langsung ke Google Sheet.`);
    });
  };

  // ─── EXPORT 3: Append to Google Sheet (via backend) ──────────────────────
  const appendToGoogleSheet = async () => {
    setLoading(true);
    setStatusMsg('⏳ Mengirim data ke Google Sheet...');

    try {
      const response = await fetch('/api/append-to-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setExported(true);
        setStatusMsg(
          `✅ ${data.length} baris berhasil dikirim ke "Pengisian Saldo"!\n` +
          `Range: ${result.updatedRange || '-'} | Rows: ${result.updatedRows || data.length}`
        );
        alert(`✅ ${data.length} baris berhasil ditambahkan ke Pengisian Saldo!\n\nBuka sheet dan klik "PROSES TRANSAKSI".`);
      } else {
        const errMsg = result.details || result.error || 'Unknown error';
        setStatusMsg(`❌ Gagal: ${errMsg}`);
        alert(`❌ Error: ${errMsg}`);
      }
    } catch (error) {
      setStatusMsg(`❌ Koneksi error: ${error.message}`);
      alert(`❌ Koneksi error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="step">
      <h2>✅ Step 4: Export Data</h2>

      <div className="success-message">
        <p>🎉 Berhasil mengekstrak {data.length} baris!</p>
        <p>Pilih metode export di bawah:</p>
      </div>

      <div className="export-options">

        {/* Option 1: CSV */}
        <div className="export-card">
          <h3>📥 Download CSV</h3>
          <p>Simpan sebagai file, import ke mana saja</p>
          <button className="btn-export" onClick={downloadCSV}>
            ⬇️ Download CSV
          </button>
        </div>

        {/* Option 2: Clipboard */}
        <div className="export-card">
          <h3>📋 Copy to Clipboard</h3>
          <p>Paste langsung ke Google Sheet</p>
          <button className="btn-export" onClick={copyToClipboard}>
            📋 Copy Tab-Separated
          </button>
        </div>

        {/* Option 3: Append to Sheet */}
        <div className="export-card">
          <h3>📊 Append to Google Sheet</h3>
          <p>Langsung kirim ke <strong>Pengisian Saldo</strong></p>
          <button
            className="btn-export"
            onClick={appendToGoogleSheet}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⏳ Mengirim...' : '🔗 Append to Sheet'}
          </button>
          <small>Auto-configured · Tidak perlu setup manual</small>
        </div>

      </div>

      {/* Status message */}
      {statusMsg && (
        <div className="completion-info" style={{ whiteSpace: 'pre-line' }}>
          <p>{statusMsg}</p>
          {exported && (
            <p>➡️ Buka Pengisian Saldo → Klik <strong>"PROSES TRANSAKSI"</strong></p>
          )}
        </div>
      )}

      <button className="btn-secondary" onClick={onReset}>
        ↻ Ekstrak Batch Berikutnya
      </button>
    </div>
  );
}

export default ExportStep;
