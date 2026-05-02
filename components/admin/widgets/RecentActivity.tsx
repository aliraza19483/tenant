import { MessageSquare } from "lucide-react";

export function RecentActivity({ type, data }: { type: string; data: any }) {
  const activity = data.recentActivity || [];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm" data-testid={`widget-${type}`}>
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activity.map((item: any, i: number) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-0.5 p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <MessageSquare size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</p>
              <p className="text-xs text-slate-500">{item.time}</p>
            </div>
          </div>
        ))}
        {activity.length === 0 && (
          <p className="text-sm text-slate-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
