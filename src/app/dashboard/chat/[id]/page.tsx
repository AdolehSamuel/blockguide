"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { SendHorizontal, Home } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

type MessageTuple = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

export default function ChatInterface() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string | undefined;

  const [messages, setMessages] = useState<MessageTuple[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId && conversationId !== "new") {
      // Fetch existing messages
      fetch(`/api/chat/history?id=${conversationId}`)
        .then(r => r.json())
        .then(data => {
          if (data.messages) setMessages(data.messages);
        })
        .catch(console.error);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    const tempId = Date.now().toString();

    setMessages(prev => [
      ...prev,
      { id: tempId, sender: "user", text: userText },
    ]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationId === "new" ? null : conversationId,
          text: userText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: data.text },
        ]);
        if (conversationId === "new") {
          router.replace(`/dashboard/chat/${data.conversationId}`);
        }
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen min-h-screen bg-[var(--body_bg)] overflow-hidden">
      {/* Header matching SheLearns Visual style but with user's brand */}
      <header className="bg-[var(--main_color)] text-white p-4 shadow-md border-b flex-shrink-0 z-10 relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">BlockGuide</h1>
          <p className="text-sm text-white/90">
            Empowering African Youth in Blockchain
          </p>
        </div>
        <Link
          href="/dashboard"
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 rounded-full transition-colors"
          title="Back to Dashboard"
        >
          <Home size={24} />
        </Link>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <div className="max-w-4xl mx-auto flex flex-col space-y-4 pb-20">
          {/* Default Welcome Message - always rendered as the first bubble */}
          <div className="flex justify-start">
            <div className="max-w-[85%] p-4 rounded-xl shadow-sm whitespace-pre-wrap bg-[var(--card_bg)] text-[var(--text_color)] border border-[var(--lines_color)] rounded-bl-none">
              Welcome to BlockGuide - Empowering African Youth in Tech!{"\n\n"}
              Main Menu{"\n"}1. Explain a blockchain concept{"\n"}2. Tell me about available learning roadmaps{"\n"}
              3. Show me basics{"\n\n"}How can I guide you today?
            </div>
          </div>

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-xl shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[var(--main_color)] text-white rounded-br-none"
                    : "bg-[var(--card_bg)] text-[var(--text_color)] border border-[var(--lines_color)] rounded-bl-none prose prose-invert max-w-none"
                }`}
              >
                {msg.sender === "user" ? (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-4 rounded-xl bg-[var(--card_bg)] text-[var(--text_color_weak)] border border-[var(--lines_color)] rounded-bl-none">
                <span className="animate-pulse">Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area matching visual (bar at bottom with brand send icon) */}
      <div className="bg-[var(--body_bg)] border-t border-[var(--lines_color)] p-4 flex-shrink-0 z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your response..."
              className="w-full bg-[var(--card_bg)] text-[var(--text_color)] border border-[var(--lines_color)] rounded-full pl-6 pr-14 py-3 focus:outline-none focus:border-[var(--main_color)] transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 p-2 text-[var(--main_color)] hover:bg-[var(--card_item_bg)] rounded-full disabled:opacity-50 transition-colors"
            >
              <SendHorizontal size={24} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
