import { useState } from 'react';
import axios from 'axios';
import './index.css'; // Don't forget to import the new CSS file

// A small component for the loading spinner
const LoadingSpinner = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

// A component to display the results in a more visual way
const ResultsDisplay = ({ result }) => {
  if (!result) return null;

  const topScoreIndex = result.scores.indexOf(Math.max(...result.scores));
  const topLabel = result.labels[topScoreIndex];
  const topScore = result.scores[topScoreIndex];

  let verdictText = 'Mixed / Neutral';
  let verdictColor = 'var(--verdict-orange)';

  if (topScore >= 0.7) {
    if (topLabel === 'Factual and Objective' || topLabel === 'तथ्यात्मक और वस्तुनिष्ठ') {
      verdictText = 'Likely Factual & Objective';
      verdictColor = 'var(--verdict-green)';
    } else {
      verdictText = 'Likely Opinion & Bias';
      verdictColor = 'var(--verdict-red)';
    }
  }

  return (
    <div className="results-container">
      {/* Verdict Box */}
      <div className="verdict-box" style={{ borderColor: verdictColor }}>
        <h3>Verdict</h3>
        <p style={{ color: verdictColor, fontWeight: 'bold' }}>{verdictText}</p>
      </div>

      {/* Score Details with Progress Bars */}
      <div className="score-details">
        <h4>Score Details:</h4>
        <div className="score-item">
          <p>
            <span>{result.labels[0]}</span>
            <strong>{Math.round(result.scores[0] * 100)}%</strong>
          </p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${result.scores[0] * 100}%` }}></div>
          </div>
        </div>
        <div className="score-item">
          <p>
            <span>{result.labels[1]}</span>
            <strong>{Math.round(result.scores[1] * 100)}%</strong>
          </p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${result.scores[1] * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};


function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyzeClick = async () => {
    if (!url) {
        setError('Please enter a URL to analyze.');
        return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8080/scrape', { url: url });
      setResult(response.data);
    } catch (err) {
      setError('Failed to get analysis. The server might be down or the URL is invalid/inaccessible.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>News Verifier AI</h1>
        <p>Analyze the linguistic bias of news articles with AI.</p>
      </header>

      <main className="App-main">
        <div className="form-container">
          <input 
            type="text"
            placeholder="Paste article URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeClick()} // Allow pressing Enter
          />
          <button onClick={handleAnalyzeClick} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {loading && <LoadingSpinner />}
        {error && <p className="error">{error}</p>}
        {result && <ResultsDisplay result={result} />}
      </main>

      {/* <footer className="App-footer">
        <p>Built as a 3-Day Full-Stack Project</p>
      </footer> */}
    </div>
  )
}

export default App;