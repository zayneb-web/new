import React, { useState } from 'react';
import axios from 'axios';

const PdfSummarizer = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!pdfFile) {
      setError('Veuillez sélectionner un fichier PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf_file', pdfFile);

    try {
      const response = await axios.post('http://localhost:8000/summarize-pdf/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSummary(response.data.summary);
      setError('');
    } catch (error) {
      setError('Une erreur s\'est produite lors de la récupération du résumé du PDF.');
      setSummary('');
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url('https://i.postimg.cc/XJ7PzZCm/Untitled-design-1.png')`,
        backgroundSize: 'cover',
      }}
    >
      <div className="max-w-md mx-auto p-8 bg-white shadow-md rounded-md transition-transform transform hover:scale-105">
        <h1 className="text-2xl font-semibold mb-4">Résumé de PDF</h1>
        <input
          type="file"
          accept=".pdf"
          className="border border-gray-300 p-2 rounded-md mb-4"
          onChange={handleFileChange}
        />
        <button
          className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          onClick={handleSubmit}
        >
          Résumer
        </button>
        {summary && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Résumé</h2>
            <p>{summary}</p>
          </div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default PdfSummarizer;
