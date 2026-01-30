
import React, { useState, useRef, useEffect } from 'react';
import { getStylistResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIStylistProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIStylist: React.FC<AIStylistProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to NOMAD. I am your personal stylist. How can I help you curate your uniform today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));
    history.push({ role: 'user', parts: [{ text: userMessage }] });

    const response = await getStylistResponse(history);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
  };

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full bg-[#fafafa]">
          <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
            <div>
              <h2 className="text-lg serif italic font-semibold">AI Stylist</h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Personal Curation</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-black text-white rounded-2xl rounded-tr-none shadow-sm' 
                  : 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for styling advice..."
                className="w-full bg-gray-50 border border-gray-100 rounded-full py-4 px-6 pr-12 text-sm outline-none focus:border-black transition"
              />
              <button 
                type="submit"
                disabled={isTyping}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full hover:scale-110 transition disabled:opacity-30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              </button>
            </form>
            <p className="text-[9px] text-center text-gray-400 mt-4 uppercase tracking-[0.2em]">Powered by Gemini AI Technology</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStylist;
