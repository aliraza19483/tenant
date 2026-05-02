"use client";

import { useState } from "react";
import { ConversationSidebar } from "./ConversationSidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface ChatShellProps {
  initialMessages?: any[];
  conversationId?: string;
  projectSlug: string;
}

export function ChatShell({ initialMessages = [], conversationId, projectSlug }: ChatShellProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSend = async (content: string) => {
    // Optimistic user message
    setMessages((prev) => [...prev, { role: "user", content }]);
    setIsTyping(true);

    try {
      const url = new URL("/api/chat", window.location.origin);
      if (conversationId) {
        url.searchParams.set("conversationId", conversationId);
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error("API failed");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);

      // If new conversation, redirect to it
      if (!conversationId && data.conversationId) {
        queryClient.invalidateQueries({ queryKey: ["conversations", projectSlug] });
        router.push(`/${projectSlug}/chat/${data.conversationId}`);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, an error occurred.", steps: ["Error"] },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950" data-testid="chat-shell">
      <ConversationSidebar />
      <div className="flex-1 flex flex-col min-w-0" data-testid="message-area">
        <MessageList messages={messages} isTyping={isTyping} />
        <MessageInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}
