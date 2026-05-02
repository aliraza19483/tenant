"use client";

import { clsx } from "clsx";
import { User, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  steps?: string[];
}

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export function MessageList({ messages, isTyping }: MessageListProps) {
  if (messages.length === 0 && !isTyping) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500" data-testid="message-list">
        <p>Start a conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6" data-testid="message-list">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={clsx(
            "flex gap-4 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both",
            msg.role === "user" ? "flex-row-reverse" : "flex-row"
          )}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-200 dark:bg-slate-700">
            {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
          </div>
          
          <div className={clsx(
            "flex flex-col gap-1",
            msg.role === "user" ? "items-end" : "items-start"
          )}>
            {msg.role === "assistant" && msg.steps && msg.steps.length > 0 && (
              <div className="flex flex-col gap-1 mb-1">
                {msg.steps.map((step, idx) => (
                  <span key={idx} className="text-xs text-slate-400 font-mono">
                    • {step}
                  </span>
                ))}
              </div>
            )}
            <div
              className={clsx(
                "px-4 py-2.5 rounded-2xl whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-slate-100 dark:bg-slate-800 rounded-tl-none border border-slate-200 dark:border-slate-700"
              )}
            >
              {msg.content}
            </div>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex gap-4 max-w-3xl mx-auto w-full flex-row">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-200 dark:bg-slate-700">
            <Bot size={16} />
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}
    </div>
  );
}
