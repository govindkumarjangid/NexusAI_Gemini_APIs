import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Image, Mic, PanelLeft } from 'lucide-react';

export default function ChatArea({ sidebarOpen, setSidebarOpen }) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: 'Hello! I am NexusAI. How can I help you today?' },
    { id: 2, role: 'user', text: 'Can you help me build a React component?' },
    { id: 3, role: 'ai', text: 'Absolutely! Id be happy to help you build a React component. Could you provide some details on what the component should do? For example, is it a button, a form, a complex layout, or something else entirely?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMsg = { id: Date.now(), role: 'user', text: inputMessage };
    setMessages([...messages, newMsg]);
    setInputMessage('');

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: 'This is a simulated response based on your query.'
      }]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#131314]">
      {/* Top Navbar */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-gray-800/60">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-lg text-gray-200">NexusAI</h1>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-[#1e1f20] text-gray-200 rounded-bl-sm border border-gray-800'
              }`}
            >
              <p className="text-[15px] leading-relaxed">{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-gradient-to-t from-[#131314] to-transparent pt-0">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSend}
            className="flex items-end gap-2 bg-[#1e1f20] border border-gray-700/60 rounded-2xl p-2 shadow-sm focus-within:ring-1 focus-within:ring-gray-600 focus-within:border-gray-600 transition-all"
          >
            <button type="button" className="p-3 hover:bg-gray-800 rounded-full text-gray-400 transition-colors self-end">
              <Image size={20} />
            </button>
            <button type="button" className="p-3 hover:bg-gray-800 rounded-full text-gray-400 transition-colors self-end mr-1">
              <Mic size={20} />
            </button>

            <textarea
              rows="1"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask NexusAI anything..."
              className="flex-1 max-h-32 bg-transparent text-gray-100 placeholder-gray-500 py-3 focus:outline-none resize-none overflow-y-auto self-center"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-full transition-colors self-end"
            >
              <Send size={18} className={inputMessage.trim() ? "translate-x-0.5" : ""} />
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-3 hidden sm:block">
            NexusAI may produce inaccurate information about people, places, or facts.
          </p>
        </div>
      </div>
    </div>
  );
}
