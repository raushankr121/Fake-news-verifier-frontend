import { useState } from 'react';
import './index.css'; // Assuming you have some basic styles

function App() {
  const [mode, setMode] = useState('url'); // 'url' or 'text'
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Prepare payload based on mode
    const payload = mode === 'url' ? { url: url } : { text: text };

    try {
        const response = await fetch('https://your-backend-name.onrender.com/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to get analysis. Server might be down or input invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>News Verifier AI 🕵️‍♂️</h1>
      
      {/* Toggle Buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setMode('url')}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: mode === 'url' ? '#007bff' : '#ddd',
            color: mode === 'url' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Verify by URL
        </button>
        <button 
          onClick={() => setMode('text')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: mode === 'text' ? '#007bff' : '#ddd',
            color: mode === 'text' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Verify Text
        </button>
      </div>

      {/* Input Area */}
      <div style={{ marginBottom: '1rem' }}>
        {mode === 'url' ? (
          <input
            type="text"
            placeholder="Paste article URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        ) : (
          <textarea
            rows="6"
            placeholder="Paste the news text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        )}
      </div>

      <button 
        onClick={handleAnalyze} 
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: loading ? '#ccc' : '#28a745', 
          color: 'white', 
          border: 'none', 
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze Bias'}
      </button>

      {/* Error Message */}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {/* Results Display */}
      {result && (
        <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
          <h3>Analysis Result:</h3>
          {result.labels.map((label, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <strong>{label}:</strong> {(result.scores[index] * 100).toFixed(1)}%
              <div style={{ background: '#eee', height: '10px', borderRadius: '5px', marginTop: '5px' }}>
                <div 
                  style={{ 
                    width: `${result.scores[index] * 100}%`, 
                    background: label.includes('Bias') ? '#dc3545' : '#28a745', 
                    height: '100%', 
                    borderRadius: '5px' 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;