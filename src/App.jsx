import React, { useState } from 'react';
import UploadStep from './components/UploadStep';
import ProcessingStep from './components/ProcessingStep';
import PreviewStep from './components/PreviewStep';
import ExportStep from './components/ExportStep';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [extractedData, setExtractedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (uploadedFiles) => {
    setFiles(uploadedFiles);
    setStep(2);
    setLoading(true);
  };

  const handleProcessing = (data) => {
    setExtractedData(data);
    setLoading(false);
    setStep(3);
  };

  const handleDataChange = (updatedData) => {
    setExtractedData(updatedData);
  };

  const handleExport = () => {
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setFiles([]);
    setExtractedData([]);
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🔴 AIST Data Extractor</h1>
        <p>PT. RIFIM INTERNATIONAL GEMILANG</p>
      </header>

      <main className="container">
        {step === 1 && <UploadStep onUpload={handleUpload} />}
        {step === 2 && <ProcessingStep files={files} onProcessing={handleProcessing} loading={loading} />}
        {step === 3 && <PreviewStep data={extractedData} onDataChange={handleDataChange} onExport={handleExport} />}
        {step === 4 && <ExportStep data={extractedData} onReset={handleReset} />}
      </main>

      <footer className="footer">
        <p>Step {step}/4 • Data processing client-side (no server storage)</p>
      </footer>
    </div>
  );
}

export default App;
