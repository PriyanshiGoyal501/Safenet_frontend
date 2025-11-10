// Scanner.jsx
import React, { useState } from "react";
import "./Signup.css";

const Scanner = () => {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [fullReport, setFullReport] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const scanURL = () => {
    if (!url) return alert("Please enter a URL");
    // Call your API to scan the URL
    setResult(`Scanning URL: ${url}`);
    // Example: setFullReport("Full report content here");
  };

  const scanFile = () => {
    if (!file) return alert("Please select a file");
    // Call your API to scan the file
    setResult(`Scanning File: ${file.name}`);
    // Example: setFullReport("Full report content here");
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="container">
      <h1>VirusTotal Scanner</h1>

      <section>
        <h2>Scan a URL</h2>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (e.g., https://example.com)"
        />
        <button onClick={scanURL}>Scan URL</button>
      </section>

      <section>
        <h2>Scan a File</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={scanFile}>Scan File</button>
      </section>

      <div id="result">
        {result}
        {result && (
          <button onClick={openModal} className="full-report-btn">
            View Full Report
          </button>
        )}
      </div>

      {modalOpen && (
        <div id="fullReportModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Full Report</h2>
            <div id="fullReportContent">{fullReport}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
