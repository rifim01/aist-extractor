import React, { useState } from 'react';

function UploadStep({ onUpload }) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = () => {
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="step">
      <h2>📸 Step 1: Upload AIST Screenshots</h2>
      
      <div
        className={`upload-area ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <label htmlFor="fileInput" className="upload-label">
          <p>📤 Drag & drop images here or click to select</p>
          <small>Max 10 screenshots, PNG/JPG</small>
        </label>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <h3>Selected Files ({files.length}):</h3>
          {files.map((file, idx) => (
            <div key={idx} className="file-item">
              <span>📄 {file.name}</span>
              <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          ))}
        </div>
      )}

      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={files.length === 0}
      >
        Start OCR Processing →
      </button>
    </div>
  );
}

export default UploadStep;
