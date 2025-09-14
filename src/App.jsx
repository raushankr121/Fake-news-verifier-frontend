import { useState } from 'react';
import axios from 'axios'; // Import axios

function App() {
  const [url, setUrl] = useState('');
  // New state to store our results
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyzeClick = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    
    
    try {
      // Use axios to send a POST request to our Go backend
      const response = await axios.post('http://localhost:8080/scrape', {
        url: url, // The data we're sending
      });
      setResult(response.data); // Store the AI's response in our state
    } catch (err) {
      setError('Failed to get analysis. The server might be down or the website is blocking us.');
      console.error(err);
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };
  // Paste this inside your App function, after handleAnalyzeClick

const renderVerdict = () => {
    if (!result) return null;

    const topScoreIndex = result.scores.indexOf(Math.max(...result.scores));
    const topLabel = result.labels[topScoreIndex];
    const topScore = result.scores[topScoreIndex];

    let verdictText = '';
    let verdictColor = '';

    if (topScore < 0.7) {
      verdictText = 'Mixed / Neutral';
      verdictColor = '#e67e22'; // Orange
    } else if (topLabel === 'Factual and Objective' || topLabel === 'तथ्यात्मक और वस्तुनिष्ठ') {
      verdictText = 'Likely Factual & Objective';
      verdictColor = '#27ae60'; // Green
    } else {
      verdictText = 'Likely Opinion & Bias';
      verdictColor = '#c0392b'; // Red
    }

    return (
      <div className="verdict-box" style={{ borderColor: verdictColor }}>
        <h3>Verdict</h3>
        <p style={{ color: verdictColor, fontWeight: 'bold' }}>{verdictText}</p>
      </div>
    );
};

  // In your App function in App.jsx...
return (
    <div className="App">
      <header className="App-header">
        <h1>Fake News Verifier</h1>
        <p>Analyze the language of news articles with AI</p>
      </header>

      <main className="App-main">
        <div className="form-container">
          <input 
            type="text"
            placeholder="Enter article URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={handleAnalyzeClick} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        <div className="results-container">
          {loading && <p>Loading, please wait...</p>}
          {error && <p className="error">{error}</p>}
          {result && (
            <div>
              {renderVerdict()}
              <h4>Score Details:</h4>
              <p>{result.labels[0]}: <strong>{Math.round(result.scores[0] * 100)}%</strong></p>
              <p>{result.labels[1]}: <strong>{Math.round(result.scores[1] * 100)}%</strong></p>
            </div>
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>Built as a 3-Day Full-Stack Project</p>
      </footer>
    </div>
  )
}

export default App