"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { MessageSquare, PlusCircle, Trash2 } from "lucide-react";
import { clsx } from "clsx";

export function ConversationSidebar() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const projectSlug = params.slug as string;
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations", projectSlug],
    queryFn: async () => {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const handleDelete = async (e: React.MouseEvent, convId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      const res = await fetch(`/api/conversations/${convId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      await queryClient.invalidateQueries({ queryKey: ["conversations", projectSlug] });

      // If we deleted the active conversation, go back to new chat
      if (pathname.includes(`/chat/${convId}`)) {
        router.push(`/${projectSlug}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete chat.");
    }
  };

  return (
    <div 
      className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col"
      data-testid="conversation-sidebar"
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          href={`/${projectSlug}`}
          className="flex items-center gap-2 w-full justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-md"
        >
          <PlusCircle size={18} />
          <span>New Chat</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading && <p className="text-sm text-slate-500 p-2 text-center">Loading...</p>}
        {conversations.map((conv: any) => {
          const isActive = pathname.includes(`/chat/${conv._id}`);
          return (
            <Link
              key={conv._id}
              href={`/${projectSlug}/chat/${conv._id}`}
              className={clsx(
                "group flex items-center justify-between gap-2 px-3 py-2.5 rounded-md text-sm transition-all duration-200",
                isActive 
                  ? "bg-slate-200 dark:bg-slate-800 font-medium shadow-sm" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:pl-4"
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <MessageSquare size={16} className="shrink-0" />
                <span className="truncate">{conv.title}</span>
              </div>
              
              <button
                onClick={(e) => handleDelete(e, conv._id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-200 hover:scale-110"
                title="Delete chat"
              >
                <Trash2 size={14} />
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
