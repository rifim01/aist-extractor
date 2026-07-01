import React, { useState } from 'react';
import Papa from 'papaparse';

function ExportStep({ data, onReset }) {
  const [exported, setExported] = useState(false);
  const [googleAuth, setGoogleAuth] = useState(false);

  const downloadCSV = () => {
    const csvData = data.map(row => ({
      Date: row.date,
      Sum: row.sum,
      'Credit Account': row.account
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `AIST_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(true);
  };

  const copyToClipboard = () => {
    const text = data
      .map(row => `${row.date}\t${row.sum}\t${row.account}`)
      .join('\n');

    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Data copied to clipboard! Paste to Google Sheet now.');
      setExported(true);
    });
  };

  const appendToGoogleSheet = async () => {
    // Simplified version - requires Google Sheets API setup
    const apiKey = 'YOUR_GOOGLE_SHEETS_API_KEY';
    const spreadsheetId = 'YOUR_SPREADSHEET_ID';
    const range = 'INPUT_DOCK_1!A4';

    const values = data.map(row => [row.date, row.sum, row.account]);

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: values,
          }),
        }
      );

      if (response.ok) {
        alert(`✅ ${data.length} rows appended to Google Sheet!`);
        setExported(true);
      } else {
        alert('❌ Error appending to Google Sheet. Check API key & spreadsheet ID.');
      }
    } catch (error) {
      console.error('Google Sheets API Error:', error);
      alert('❌ API Error. See console for details.');
    }
  };

  return (
    <div className="step">
      <h2>✅ Step 4: Export Data</h2>

      <div className="success-message">
        <p>🎉 Successfully extracted {data.length} rows!</p>
        <p>Choose export method below:</p>
      </div>

      <div className="export-options">
        <div className="export-card">
          <h3>📥 Download CSV</h3>
          <p>Save as file, import anywhere</p>
          <button className="btn-export" onClick={downloadCSV}>
            ⬇️ Download CSV
          </button>
        </div>

        <div className="export-card">
          <h3>📋 Copy to Clipboard</h3>
          <p>Paste directly to Google Sheet</p>
          <button className="btn-export" onClick={copyToClipboard}>
            📋 Copy Tab-Separated
          </button>
        </div>

        <div className="export-card">
          <h3>📊 Append to Google Sheet</h3>
          <p>Direct append to INPUT_DOCK_1</p>
          <button className="btn-export" onClick={appendToGoogleSheet}>
            🔗 Append to Sheet
          </button>
          <small>Requires API key configuration</small>
        </div>
      </div>

      {exported && (
        <div className="completion-info">
          <p>✅ Data exported successfully!</p>
          <p>Next: Paste to Google Sheet → Run "Proses Transaksi"</p>
        </div>
      )}

      <button className="btn-secondary" onClick={onReset}>
        ↻ Extract Another Batch
      </button>
    </div>
  );
}

export default ExportStep;
