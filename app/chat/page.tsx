"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  contextFound?: boolean;
  contextCount?: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (res.ok) {
        // Add bot response
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: data.response,
          contextFound: data.contextFound,
          contextCount: data.contextCount
        }]);
      } else {
        // Handle error
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: data.response || data.error || "Sorry, something went wrong."
        }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: " Error connecting to chat. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-bold text-indigo-600">🏏 CricketSensei</h1>
        <p className="text-gray-600 text-sm">Your AI cricket expert with RAG-powered knowledge</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Welcome to CricketSensei! 🏏
              </h2>
              <p className="text-gray-600 mb-6">
                Ask me anything about cricket - rules, history, players, formats, and more!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button
                  onClick={() => setInput("What is Test cricket?")}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition text-left"
                >
                  <p className="text-sm text-indigo-600 font-medium">What is Test cricket?</p>
                </button>
                <button
                  onClick={() => setInput("Tell me about the IPL")}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition text-left"
                >
                  <p className="text-sm text-indigo-600 font-medium">Tell me about the IPL</p>
                </button>
                <button
                  onClick={() => setInput("How do you score runs in cricket?")}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition text-left"
                >
                  <p className="text-sm text-indigo-600 font-medium">How do you score runs in cricket?</p>
                </button>
                <button
                  onClick={() => setInput("Who are some famous cricket players?")}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition text-left"
                >
                  <p className="text-sm text-indigo-600 font-medium">Who are some famous cricket players?</p>
                </button>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-800 shadow"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.role === "assistant" && message.contextFound && (
                  <p className="text-xs text-gray-500 mt-2">
                    📚 Used {message.contextCount} relevant cricket knowledge sources
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-3xl px-4 py-3 rounded-lg bg-white shadow">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cricket..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
