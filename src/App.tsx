import { useState, useEffect, useCallback } from 'react';
import { translateText } from './services/geminiService';

interface Joke {
  setup: string;
  punchline: string;
}

interface Quote {
  quote: string;
  author: string;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
  { code: 'ja', name: '日本語' },
];

export default function App() {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [language, setLanguage] = useState('ko');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (targetLang: string) => {
    setLoading(true);
    setError(null);
    try {
      const [jokeRes, quoteRes] = await Promise.all([
        fetch('https://official-joke-api.appspot.com/random_joke'),
        fetch('https://dummyjson.com/quotes/random')
      ]);
      
      if (!jokeRes.ok || !quoteRes.ok) throw new Error('API request failed');
      
      const jokeData = await jokeRes.json();
      const quoteData = await quoteRes.json();
      
      // Translate in parallel
      const [translatedSetup, translatedPunchline, translatedQuote] = await Promise.all([
        translateText(jokeData.setup, targetLang),
        translateText(jokeData.punchline, targetLang),
        translateText(quoteData.quote, targetLang)
      ]);

      setJoke({ setup: translatedSetup, punchline: translatedPunchline });
      setQuote({ quote: translatedQuote, author: quoteData.author });
    } catch (err) {
      setError('데이터를 가져오거나 번역하는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(language);
  }, [language, fetchData]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">ZenBreak</h1>
        
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
        
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-800">{joke?.setup}</p>
              <p className="text-blue-600 mt-2">{joke?.punchline}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="italic text-gray-700">"{quote?.quote}"</p>
              <p className="text-right text-sm text-gray-500 mt-2">- {quote?.author}</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => fetchData(language)}
          className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition"
        >
          새로운 휴식 가져오기
        </button>
      </div>
    </div>
  );
}
