import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Loader2, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { MAX_INPUT_LENGTHS } from "@/lib/sanitize";

/**
 * Simple keyword-based sentiment analysis (demo mode).
 * Counts positive/negative word occurrences and computes a score.
 */
function analyzeSentiment(text) {
  const positiveWords = [
    'love', 'great', 'excellent', 'amazing', 'happy', 'wonderful', 'best',
    'fantastic', 'brilliant', 'outstanding', 'superb', 'perfect', 'delightful',
    'impressive', 'exceptional', 'exceeded', 'beautiful', 'awesome',
  ];
  const negativeWords = [
    'terrible', 'awful', 'hate', 'worst', 'bad', 'horrible', 'rude',
    'poor', 'disappointing', 'dreadful', 'miserable', 'pathetic', 'useless',
    'frustrating', 'annoying', 'disgusting', 'broken', 'failed',
  ];

  const lower = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  const foundPositive = [];
  const foundNegative = [];

  positiveWords.forEach(w => {
    const regex = new RegExp(`\\b${w}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) {
      positiveCount += matches.length;
      foundPositive.push(w);
    }
  });

  negativeWords.forEach(w => {
    const regex = new RegExp(`\\b${w}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) {
      negativeCount += matches.length;
      foundNegative.push(w);
    }
  });

  const wordCount = text.split(/\s+/).length;
  const score = positiveCount - negativeCount;
  let sentiment = 'neutral';
  let confidence = 50;

  if (score > 0) {
    sentiment = 'positive';
    confidence = Math.min(50 + score * 15, 95);
  } else if (score < 0) {
    sentiment = 'negative';
    confidence = Math.min(50 + Math.abs(score) * 15, 95);
  }

  const explanationParts = [];
  if (foundPositive.length > 0) {
    explanationParts.push(`Positive indicators found: ${foundPositive.join(', ')}`);
  }
  if (foundNegative.length > 0) {
    explanationParts.push(`Negative indicators found: ${foundNegative.join(', ')}`);
  }
  if (foundPositive.length === 0 && foundNegative.length === 0) {
    explanationParts.push('No strong sentiment markers detected.');
  }
  explanationParts.push(`Analyzed ${wordCount} words. Demo mode — lexical analysis only.`);

  return {
    sentiment,
    confidence,
    explanation: explanationParts.join(' '),
  };
}

export default function SentimentAnalyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const examples = [
    "This product exceeded my expectations! Absolutely love it.",
    "The service was terrible and the staff was rude.",
    "It's okay, nothing special but does the job.",
  ];

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      const analysis = analyzeSentiment(text);
      setResult(analysis);
    } catch (error) {
      setResult({ sentiment: "error", confidence: 0, explanation: "Error analyzing sentiment" });
    }
    setLoading(false);
  };

  const getSentimentIcon = () => {
    if (!result) return null;
    switch (result.sentiment.toLowerCase()) {
      case "positive":
        return <ThumbsUp className="w-6 h-6 text-green-400" />;
      case "negative":
        return <ThumbsDown className="w-6 h-6 text-red-400" />;
      default:
        return <Minus className="w-6 h-6 text-gray-400" />;
    }
  };

  const getSentimentColor = () => {
    if (!result) return "#6b7280";
    switch (result.sentiment.toLowerCase()) {
      case "positive":
        return "#10b981";
      case "negative":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl">Sentiment Analyzer</h2>
          <p className="text-gray-500 text-sm">Demo mode · Lexical keyword analysis</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Text to Analyze</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze sentiment..."
            className="min-h-32 bg-[#0a0f1e] border-[#1e2a3a] text-white resize-none"
            maxLength={MAX_INPUT_LENGTHS.sentimentText}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Examples:</span>
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setText(ex)}
              className="text-xs bg-[#0a0f1e] border border-[#1e2a3a] text-gray-400 px-3 py-1 rounded-full hover:border-blue-500 hover:text-blue-400 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4 mr-2" /> Analyze Sentiment
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="bg-[#0a0f1e] border border-[#1e2a3a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            {getSentimentIcon()}
            <div className="flex-1">
              <h3 className="text-white font-semibold capitalize">{result.sentiment}</h3>
              <p className="text-gray-500 text-sm">Confidence: {result.confidence}%</p>
            </div>
          </div>
          <div className="w-full bg-[#111827] rounded-full h-2 mb-4">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${result.confidence}%`,
                backgroundColor: getSentimentColor(),
              }}
            />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{result.explanation}</p>
        </div>
      )}
    </div>
  );
}
