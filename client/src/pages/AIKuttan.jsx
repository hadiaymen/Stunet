import { useState, useRef, useEffect } from 'react';

const suggestedPrompts = [
  { icon: 'quiz', label: 'Generate Quiz' },
  { icon: 'summarize', label: 'Summarize Notes' },
  { icon: 'history_edu', label: 'Review PYQs' },
  { icon: 'psychology', label: 'Explain Concept' },
];

const initialMessages = [
  {
    id: 1,
    type: 'bot',
    text: "Hello there! I've indexed your latest Quantum Mechanics notes and the last 5 years of PYQs. How can I help you study today?",
  },
];

// Simulated AI responses
const aiResponses = {
  default: "I can help you with that! Based on your uploaded notes and PYQs, here's what I found:\n\n• This topic is covered in Module 3 of your syllabus\n• It appeared in 3 out of the last 5 year PYQs\n• Key concepts to focus on include the definitions and derivations\n\nWould you like me to generate a practice quiz on this topic?",
  quiz: "📝 **Quick Quiz - Quantum Mechanics**\n\n**Q1.** State Heisenberg's Uncertainty Principle and give its mathematical expression.\n\n**Q2.** What is the physical significance of the wave function ψ?\n\n**Q3.** Derive the time-independent Schrödinger equation.\n\n**Q4.** Explain the concept of quantum tunneling with a diagram.\n\nShall I provide model answers for any of these?",
  summarize: "📋 **Quick Revision Summary - Current Notes**\n\n**Module 3: Graph Theory**\n\n🔑 **Key Terms:**\n• Graph G = (V, E) - Set of vertices and edges\n• Degree of vertex - Number of edges incident to it\n• Connected graph - Path exists between every pair of vertices\n\n📐 **Important Formulas:**\n• Sum of degrees = 2 × |E| (Handshaking Lemma)\n• For tree: |E| = |V| - 1\n• Euler's formula: V - E + F = 2\n\n⚠️ **Frequently Asked in PYQs:**\n• Prove Handshaking Lemma\n• Euler path/circuit conditions\n• Graph isomorphism",
  reject: "⚠️ **Academic Context Only**\n\nI'm designed to help you with academic topics related to your uploaded notes and curriculum. I can't help with questions outside your academic scope.\n\nHere's what I can help with:\n• Explaining concepts from your notes\n• Generating exam-oriented answers\n• Summarizing study material\n• Creating practice quizzes\n\nPlease ask something related to your subjects!",
};

export default function AIKuttan() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMsg) => {
    const lower = userMsg.toLowerCase();
    // Check for non-academic queries
    const nonAcademic = ['weather', 'movie', 'game', 'joke', 'song', 'recipe', 'news', 'sports', 'cricket', 'football'];
    if (nonAcademic.some(w => lower.includes(w))) return aiResponses.reject;
    if (lower.includes('quiz') || lower.includes('test')) return aiResponses.quiz;
    if (lower.includes('summar') || lower.includes('revision')) return aiResponses.summarize;
    return aiResponses.default;
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), type: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: response }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handlePrompt = (label) => {
    sendMessage(label);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-180px)]">
      {/* AI Kuttan Intro */}
      {messages.length <= 1 && (
        <div className="flex flex-col items-center text-center mb-stack-lg">
          <div className="w-20 h-20 rounded-2xl glass-vessel flex items-center justify-center mb-4 border border-tertiary/30">
            <span className="material-symbols-outlined text-tertiary text-5xl filled">smart_toy</span>
          </div>
          <h2 className="font-grotesk text-h1 text-on-surface mb-2">AI Kuttan</h2>
          <p className="text-body-lg text-on-surface-variant max-w-lg">
            Your academic companion. Ask me anything about your notes, previous year questions, or complex concepts.
          </p>
        </div>
      )}

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-stack-md pr-2 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 items-start ${msg.type === 'user' ? 'justify-end ml-auto' : ''} max-w-[85%] ${msg.type === 'user' ? 'ml-auto' : ''}`}>
            {msg.type === 'bot' && (
              <div className="w-8 h-8 rounded-lg glass-vessel flex-shrink-0 flex items-center justify-center text-tertiary border border-tertiary/20">
                <span className="material-symbols-outlined text-sm filled">smart_toy</span>
              </div>
            )}
            <div className={`rounded-2xl p-4 ${
              msg.type === 'user'
                ? 'bg-primary text-on-primary rounded-tr-none shadow-[0_8px_20px_rgba(0,103,99,0.3)]'
                : 'glass-vessel rounded-tl-none shadow-sm'
            }`}>
              <div className={`text-body-md whitespace-pre-line ${msg.type === 'bot' ? 'text-on-surface' : ''}`}>
                {msg.text}
              </div>
            </div>
            {msg.type === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex-shrink-0 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-sm">person</span>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-4 items-start max-w-[85%]">
            <div className="w-8 h-8 rounded-lg glass-vessel flex-shrink-0 flex items-center justify-center text-tertiary border border-tertiary/20">
              <span className="material-symbols-outlined text-sm filled">smart_toy</span>
            </div>
            <div className="glass-vessel rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5">
              <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions & Input */}
      <div className="mt-stack-lg space-y-stack-sm">
        {/* Suggested Prompts */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt.label}
              onClick={() => handlePrompt(prompt.label)}
              className="glass-vessel px-4 py-2 rounded-full whitespace-nowrap text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all font-inter text-caption flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">{prompt.icon}</span>
              {prompt.label}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <form onSubmit={handleSubmit} className="glass-vessel rounded-2xl p-2 flex items-center gap-2 shadow-lg ring-1 ring-white/30">
          <button type="button" className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">attachment</span>
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Kuttan anything..."
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50 font-inter text-body-md px-2"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-primary text-on-primary w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,103,99,0.3)] hover:translate-y-[-2px] transition-transform active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
