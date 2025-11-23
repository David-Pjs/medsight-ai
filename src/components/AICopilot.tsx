// src/components/AICopilot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { chatWithCopilot } from '../api/ai';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AICopilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: `👋 Hello! I'm MedSight AI, your clinical assistant.

I can help you with:
🩺 Clinical questions about patients
💊 Drug interactions and dosing
🌍 Nigerian disease management (malaria, typhoid, HIV)
🗣️ Translate patient terms (Yoruba, Igbo, Hausa, Pidgin)

How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const textToSend = input;
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithCopilot(textToSend);

      const aiMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content:
          response.response ||
          'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content:
          'Sorry, I\'m having trouble connecting. Please try again later.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    'Translate "ori nfo"',
    'Malaria treatment',
    'Drug interaction check',
    'Typhoid management',
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 group"
      >
        <div className="relative">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>
        <span className="absolute bottom-full right-0 mb-2 w-48 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask MedSight AI anything
        </span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col"
      style={{ height: '600px', maxHeight: 'calc(100vh - 3rem)' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            🤖
          </div>
          <div>
            <h3 className="font-semibold text-sm">MedSight AI</h3>
            <p className="text-xs text-purple-100">Clinical Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div
                className={`text-xs mt-1 ${
                  msg.role === 'user'
                    ? 'text-purple-200'
                    : 'text-slate-400'
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t border-slate-200 bg-white">
          <p className="text-xs text-slate-500 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => setInput(action)}
                className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-100 transition"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-slate-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about patients, meds, translations..."
            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICopilot;
