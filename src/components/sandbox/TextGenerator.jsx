import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { MAX_INPUT_LENGTHS } from "@/lib/sanitize";

export default function TextGenerator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const examples = [
    "Write a technical blog post introduction about neural networks",
    "Explain gradient descent in simple terms",
    "Generate Python code for data preprocessing",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult("");
    try {
      // Simulate LLM generation delay
      await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

      const mockOutput = `**AI-Generated Content** (Demo Mode)

Based on your prompt: *"${prompt.substring(0, 80)}${prompt.length > 80 ? '...' : ''}"*

---

This is a **simulated response** demonstrating what this text generation tool would produce when connected to a language model. In a production deployment, this would be powered by an LLM API (such as GPT-4, Claude, or an open-source model).

---

## Sample Output

The generated content would appear here with proper formatting, code blocks, lists, and structured text based on your input. The demo preserves the full UX flow — loading states, error handling, and result display — so you can evaluate the interface.

### Key capabilities this demo showcases:
- Real-time text generation with loading indicators
- Prompt input with length validation
- Example prompts for quick testing
- Error state handling

> 💡 To enable real generation, connect an LLM API endpoint and replace the mock function.`;
      setResult(mockOutput);
    } catch (error) {
      setResult("Error generating text. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl">AI Text Generator</h2>
          <p className="text-gray-500 text-sm">Demo mode · Simulated language model</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Your Prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="min-h-32 bg-[#0a0f1e] border-[#1e2a3a] text-white resize-none"
            maxLength={MAX_INPUT_LENGTHS.textGenPrompt}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Try:</span>
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setPrompt(ex)}
              className="text-xs bg-[#0a0f1e] border border-[#1e2a3a] text-gray-400 px-3 py-1 rounded-full hover:border-teal-500 hover:text-teal-400 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" /> Generate Text
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="bg-[#0a0f1e] border border-[#1e2a3a] rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" /> Generated Result
          </h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
}
