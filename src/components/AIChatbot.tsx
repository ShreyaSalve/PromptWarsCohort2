import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  X, 
  Sparkles, 
  User, 
  Bot, 
  Info,
  Globe,
  Loader2
} from 'lucide-react';
import { askVotingQuestion } from '../services/gemini';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatbot = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Greeting citizen. I am ELECTRA. I can assist with any queries regarding the Indian electoral process. How may I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await askVotingQuestion(userMsg);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] glass flex flex-col p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full glass border border-[#00FFA3]/30 flex items-center justify-center hologram-glow">
            <Bot size={20} className="text-[#00FFA3]" />
          </div>
          <div>
            <h2 className="text-[#00FFA3] font-mono text-[10px] uppercase tracking-widest">Neural Link Active</h2>
            <h3 className="text-xl font-bold">ELECTRA AI</h3>
          </div>
        </div>
        <button onClick={onClose} className="p-2 glass rounded-full hover:border-[#00FFA3]/50">
          <X size={18} />
        </button>
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 no-scrollbar scroll-smooth"
      >
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-blue-500/10 border border-blue-500/20 text-blue-100 rounded-tr-none' 
                : 'glass border-white/5 rounded-tl-none'            }`}>
              <div className="markdown-body">
                <Markdown>{m.content}</Markdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-[#00FFA3]" />
              <span className="text-xs font-mono opacity-50 uppercase tracking-widest">Processing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['How do I register?', 'What is NOTA?', 'Voting eligibility'].map((q) => (
            <button 
              key={q}
              onClick={() => setInput(q)}
              className="whitespace-nowrap px-3 py-1.5 glass rounded-full text-[10px] uppercase font-bold tracking-wider hover:border-[#00FFA3]/50"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar opacity-60">
          {[
            { label: 'हिन्दी में पूछें', text: 'मतदान के लिए पंजीकरण कैसे करें?' },
            { label: 'தமிழில் கேளுங்கள்', text: 'வாக்காளர் அடையாள அட்டை பெறுவது எப்படி?' },
            { label: 'বাংলায় জিজ্ঞাসা করুন', text: 'ভোট দেওয়ার নিয়ম কি?' }
                     ].map((lang) => (
            <button 
              key={lang.label}
              onClick={() => setInput(lang.text)}
              className="whitespace-nowrap px-3 py-1.5 glass rounded-full text-[10px] font-medium tracking-tight border-white/5 hover:border-white/20"
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="relative">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask in English, हिन्दी, தமிழ், বাংলা..."
          className="w-full glass bg-transparent p-5 rounded-2xl border-white/10 focus:border-[#00FFA3]/50 outline-none text-sm pr-16 placeholder:opacity-40"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#00FFA3] text-[#0A192F] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,163,0.3)] disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 opacity-30">
        <Globe size={12} />
        <span className="text-[10px] font-mono uppercase tracking-widest">Multilingual Protocol Enabled</span>
      </div>
    </div>
  );
};
