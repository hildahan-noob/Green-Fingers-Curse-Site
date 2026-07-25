import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Sprout, RefreshCw } from 'lucide-react';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const ExpertChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I am your Noi Gardens AI Botanist. Ask me anything about watering schedules, soil mixes, leaf troubleshooting, or repotting your plants!",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    'Why are my Monstera leaves turning yellow?',
    'How often should I water my Snake Plant in summer?',
    'What is the best light level for Peace Lilies?',
    'How to encourage fenestrations on Monstera?',
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/plant-expert', {
        method: 'POST',
        headers: { 'Content-[#Type]': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: Message = {
          sender: 'ai',
          text: data.reply || "For optimal foliage health, keep your plant in bright indirect light and water only when the top 2 inches of soil feel dry to touch.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Fallback response
      const aiMsg: Message = {
        sender: 'ai',
        text: `Regarding "${textToSend}": Most tropical indoor plants like Monstera and Calathea thrive in bright indirect light with 60%+ humidity. Make sure your pot has drainage holes and water thoroughly when topsoil is dry!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 mb-28 flex flex-col h-[82vh]">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#b80049] text-white flex items-center justify-center shadow-sm">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-[#1a1c1c] flex items-center gap-1.5">
              AI Botanical Advisor <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            </h1>
            <p className="text-[11px] text-[#006b1b] font-medium">Online • Expert Guidance</p>
          </div>
        </div>
        <button
          onClick={() =>
            setMessages([
              {
                sender: 'ai',
                text: 'Chat history cleared. How can I assist your garden today?',
                time: 'Just now',
              },
            ])
          }
          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          title="Clear Chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user' ? 'bg-[#1a1c1c] text-white' : 'bg-[#b80049] text-white'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#1a1c1c] text-white rounded-tr-none'
                  : 'bg-white border border-[#e2e2e2] text-[#1a1c1c] rounded-tl-none shadow-2xs'
              }`}
            >
              <p>{m.text}</p>
              <span
                className={`block text-[9px] mt-1.5 text-right ${
                  m.sender === 'user' ? 'text-gray-400' : 'text-gray-400'
                }`}
              >
                {m.time}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 italic p-2">
            <Bot className="w-4 h-4 text-[#b80049] animate-bounce" />
            <span>AI Botanist is evaluating leaf parameters...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="py-2 flex gap-2 overflow-x-auto hide-scrollbar">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="shrink-0 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[#b80049] text-[11px] font-bold rounded-full transition-all cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 pt-2 border-t border-gray-200"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a plant care question..."
          className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-[#b80049]"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-5 py-2.5 bg-[#b80049] hover:bg-[#e2165f] disabled:opacity-50 text-white rounded-full font-bold text-xs transition-all flex items-center justify-center cursor-pointer shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </main>
  );
};
