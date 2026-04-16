import { useState, useEffect } from 'react';
import { RefreshCw, Copy, CheckCircle2 } from 'lucide-react';

interface Quote {
  id: number;
  phrase: string;
}

// Ensure TypeScript knows about window.APP_CONFIG
declare global {
  interface Window {
    APP_CONFIG: {
      backendUrl: string;
    };
  }
}

function App() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.APP_CONFIG?.backendUrl || '';
      const response = await fetch(`${backendUrl}/api/quote/random`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      
      if (response.status === 204) {
        setQuote({ id: 0, phrase: "No quotes available. Please seed the database." });
        return;
      }

      const data = await response.json();
      setQuote(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleCopy = () => {
    if (quote?.phrase) {
      navigator.clipboard.writeText(quote.phrase);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container">
      <div className="quote-card">
        <h1 className="title">Daily Inspiration</h1>
        
        <div className="quote-content">
          {loading ? (
            <div className="skeleton-loader"></div>
          ) : error ? (
             <div className="error-message">{error}</div>
          ) : (
            <blockquote>
              "{quote?.phrase || 'Welcome to the Random Quote Machine!'}"
            </blockquote>
          )}
        </div>

        <div className="actions">
          <button 
            onClick={fetchQuote} 
            disabled={loading}
            className="btn btn-primary"
          >
            <RefreshCw className={`icon ${loading ? 'spin' : ''}`} size={18} />
            Еще фраза
          </button>
          
          <button 
            onClick={handleCopy} 
            disabled={!quote?.phrase || loading}
            className={`btn btn-secondary ${copied ? 'copied' : ''}`}
          >
            {copied ? <CheckCircle2 className="icon" size={18} /> : <Copy className="icon" size={18} />}
            {copied ? 'Скопировано!' : 'Скопировать'}
          </button>
        </div>
      </div>
      
      <div className="background-decorations">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
    </div>
  );
}

export default App;
