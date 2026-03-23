"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ChatQuestionnaire() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ sender: "bot" | "user"; text: string }[]>([
    { sender: "bot", text: "Welcome to BlockGuide! Let's find the best learning path for you." },
    { sender: "bot", text: "What is your primary interest in Blockchain technology?" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSelectOption = async (option: "Coding" | "DeFi" | "Basics") => {
    setMessages((prev) => [...prev, { sender: "user", text: `I am interested in ${option}` }]);
    setLoading(true);

    let roadmapTitle = "Blockchain Basics";
    if (option === "Coding") roadmapTitle = "Smart Contract Developer";
    if (option === "DeFi") roadmapTitle = "DeFi Enthusiast";

    setMessages((prev) => [...prev, { sender: "bot", text: `Great choice! Setting up your "${roadmapTitle}" roadmap...` }]);

    try {
      const res = await fetch("/api/roadmap/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interest: option }),
      });

      if (res.ok) {
        // Refresh the page to show the roadmap dashboard instead of chat
        router.refresh();
      } else {
        console.error("Failed to assign roadmap");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-2xl bg-[var(--card_bg)] rounded-xl border border-[var(--lines_color)] shadow-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-[var(--main_color)] text-white rounded-br-none"
                  : "bg-[var(--card_item_bg)] text-[var(--text_color)] border border-[var(--lines_color)] rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 bg-[var(--card_item_bg)] text-[var(--text_color_weak)] border border-[var(--lines_color)] rounded-lg rounded-bl-none">
              Typing...
            </div>
          </div>
        )}
      </div>

      {!loading && messages.length <= 2 && (
        <div className="p-4 bg-[var(--card_item_bg)] border-t border-[var(--lines_color)]">
          <p className="text-sm text-[var(--text_color_weak)] mb-3">Select your interest:</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleSelectOption("Coding")}
              className="px-4 py-2 bg-[var(--body_bg)] hover:bg-[var(--lines_color)] border border-[var(--lines_color)] text-[var(--text_color)] rounded transition-colors text-sm"
            >
              Coding & Smart Contracts
            </button>
            <button
              onClick={() => handleSelectOption("DeFi")}
              className="px-4 py-2 bg-[var(--body_bg)] hover:bg-[var(--lines_color)] border border-[var(--lines_color)] text-[var(--text_color)] rounded transition-colors text-sm"
            >
              Investing & DeFi
            </button>
            <button
              onClick={() => handleSelectOption("Basics")}
              className="px-4 py-2 bg-[var(--body_bg)] hover:bg-[var(--lines_color)] border border-[var(--lines_color)] text-[var(--text_color)] rounded transition-colors text-sm"
            >
              Just the Basics
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
