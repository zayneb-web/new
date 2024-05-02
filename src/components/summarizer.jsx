import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import Swal from 'sweetalert2';

function Summarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/summarize/', { text });
      setSummary(response.data.summary);
      setShowQRCode(true);
      Swal.fire({
        icon: 'success',
        title: 'Summarize Successful!',
        text: 'You can now scan the QR code to get the summary.',
      });
    } catch (error) {
      setError('An error occurred while fetching data.');
    }

    setIsLoading(false);
  };

  return (
    <div
    className="flex flex-col items-center justify-center min-h-screen"
    style={{
      backgroundImage: `url('https://i.postimg.cc/XJ7PzZCm/Untitled-design-1.png')`,
      backgroundSize: 'cover',
    }}
  >
          <h1 className="text-3xl font-bold mb-8">Text Summarizer</h1>
      <form onSubmit={handleSubmit} className="max-w-lg w-full">
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Enter text to summarize..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-blue-500 resize-none"
          rows="8"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {showQRCode && (
        <div className="flex items-center justify-center max-w-lg w-full bg-white p-4 rounded-md shadow mt-4">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Summary QR Code</h2>
            <QRCode value={summary} size={300} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Summarizer;
