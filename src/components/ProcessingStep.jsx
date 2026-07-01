import React, { useEffect } from 'react';
import Tesseract from 'tesseract.js';

function ProcessingStep({ files, onProcessing, loading }) {
  const [progress, setProgress] = React.useState([]);

  useEffect(() => {
    if (!loading) return;
    processFiles();
  }, [loading]);

  const processFiles = async () => {
    const allRows = [];
    const newProgress = files.map(() => 0);

    for (let i = 0; i < files.length; i++) {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const imageData = e.target.result;

        try {
          const result = await Tesseract.recognize(imageData, 'eng', {
            logger: (m) => {
              if (m.status === 'recognizing') {
                newProgress[i] = Math.floor(m.progress * 100);
                setProgress([...newProgress]);
              }
            },
          });

          const text = result.data.text;
          const rows = parseOCRText(text);
          allRows.push(...rows);

          newProgress[i] = 100;
          setProgress([...newProgress]);
        } catch (error) {
          console.error('OCR Error:', error);
        }
      };
      fileReader.readAsDataURL(files[i]);
    }

    setTimeout(() => {
      const cleanedData = deduplicateRows(allRows);
      onProcessing(cleanedData);
    }, 5000);
  };

  const parseOCRText = (text) => {
    const lines = text.split('\n').filter(l => l.trim());
    const rows = [];

    for (const line of lines) {
      const match = line.match(/(\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}:\d{2})\s+(\d+\s+\d+)\s+(.+)/);
      if (match) {
        const [, date, sum, account] = match;
        rows.push({
          date: date.trim(),
          sum: sum.replace(/\s+/g, ''),
          account: account.trim(),
          errors: []
        });
      }
    }

    return rows;
  };

  const deduplicateRows = (rows) => {
    const seen = new Set();
    return rows.filter(row => {
      const key = `${row.date}|${row.sum}|${row.account}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  return (
    <div className="step">
      <h2>⏳ Step 2: OCR Processing</h2>
      
      <div className="progress-container">
        {progress.map((p, i) => (
          <div key={i} className="progress-item">
            <div className="progress-label">{files[i]?.name || `File ${i + 1}`}</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${p}%` }}>{p}%</div>
            </div>
          </div>
        ))}
      </div>

      <p className="info">Processing {files.length} images with Tesseract.js OCR...</p>
    </div>
  );
}

export default ProcessingStep;
