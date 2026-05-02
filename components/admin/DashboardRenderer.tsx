"use client";

import { StatCard } from "./widgets/StatCard";
import { IntegrationStatus } from "./widgets/IntegrationStatus";
import { RecentActivity } from "./widgets/RecentActivity";
import { ConversationChart } from "./widgets/ConversationChart";

const WIDGET_MAP: Record<string, React.ComponentType<any>> = {
  "stat_total_conversations": StatCard,
  "stat_active_users": StatCard,
  "integration_shopify": IntegrationStatus,
  "integration_crm": IntegrationStatus,
  "recent_activity": RecentActivity,
  "conversation_chart": ConversationChart,
};

interface DashboardRendererProps {
  config: {
    sections: {
      id: string;
      label: string;
      widgets: string[];
    }[];
  };
  data: any;
}

export function DashboardRenderer({ config, data }: DashboardRendererProps) {
  if (!config || !config.sections) return null;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12" data-testid="admin-dashboard">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold tracking-wide uppercase">Config Driven</span>
      </div>

      <div className="space-y-12">
        {config.sections.map((section) => (
          <section key={section.id} className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{section.label}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.widgets.map((widgetType) => {
                const Widget = WIDGET_MAP[widgetType];
                if (!Widget) return null;
                return <Widget key={widgetType} type={widgetType} data={data} />;
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
