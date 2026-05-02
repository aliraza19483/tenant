import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ChatShell } from "../../../../components/chat/ChatShell";
import Conversation from "../../../../lib/db/models/Conversation";
import connectToDatabase from "../../../../lib/db/connect";
import Link from "next/link";
import { Settings } from "lucide-react";

export default async function ConversationPage({
  params,
}: {
  params: { slug: string; convId: string };
}) {
  const sessionCookie = cookies().get("session");
  if (!sessionCookie) redirect("/login");

  const session = JSON.parse(sessionCookie.value);
  if (session.projectSlug !== params.slug) {
    redirect(`/${session.projectSlug}`);
  }

  await connectToDatabase();
  const conversation = await Conversation.findById(params.convId).lean();
  
  if (!conversation) {
    redirect(`/${params.slug}`);
  }

  // Convert raw DB docs to plain objects
  const initialMessages = (conversation as any).messages.map((m: any) => ({
    role: m.role,
    content: m.content,
    steps: m.steps || [],
  }));

  const isAdmin = session.role === "admin";

  return (
    <div className="relative">
      <ChatShell 
        projectSlug={params.slug} 
        conversationId={params.convId} 
        initialMessages={initialMessages} 
      />
      {isAdmin && (
        <Link 
          href={`/${params.slug}/admin`}
          className="absolute top-4 right-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-2 rounded-full text-slate-600 hover:text-blue-600 transition-colors z-50 flex items-center gap-2 pr-4 group"
        >
          <div className="bg-slate-100 dark:bg-slate-700 p-1.5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            <Settings size={18} />
          </div>
          <span className="text-sm font-medium">Admin</span>
        </Link>
      )}
    </div>
  );
}
