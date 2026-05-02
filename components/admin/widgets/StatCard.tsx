export function StatCard({ type, data }: { type: string; data: any }) {
  const isTotal = type === "stat_total_conversations";
  const title = isTotal ? "Total Conversations" : "Active Users";
  const value = isTotal ? data.totalConversations : data.activeUsers;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm" data-testid={`widget-${type}`}>
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
        <span className="text-sm text-green-600 font-medium">+12%</span>
      </div>
    </div>
  );
}
