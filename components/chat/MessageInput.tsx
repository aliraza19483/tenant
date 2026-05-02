"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800" data-testid="message-input">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[52px] max-h-[200px]"
          rows={1}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:hover:bg-transparent transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-sm"
        >
          <SendHorizontal size={20} />
        </button>
      </form>
    </div>
  );
}
