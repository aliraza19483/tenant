import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdmin } from "../../../lib/access/admin";
import { getDashboardConfig, getDashboardData } from "../../../lib/services/dashboard.service";
import { DashboardRenderer } from "../../../components/admin/DashboardRenderer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminDashboardPage({ params }: { params: { slug: string } }) {
  const sessionCookie = cookies().get("session");
  if (!sessionCookie) redirect("/login");

  const session = JSON.parse(sessionCookie.value);
  
  if (session.projectSlug !== params.slug) {
    redirect(`/${session.projectSlug}`);
  }

  if (!isAdmin(session.role)) {
    redirect(`/${params.slug}`);
  }

  const config = await getDashboardConfig(session.projectId);
  const data = await getDashboardData(session.projectId);

  if (!config) {
    return <div>Dashboard config not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-8 pt-8">
        <Link 
          href={`/${params.slug}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Chat</span>
        </Link>
      </div>
      <DashboardRenderer config={config} data={data} />
    </div>
  );
}
