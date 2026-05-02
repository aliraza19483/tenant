import { CheckCircle2, XCircle } from "lucide-react";

export function IntegrationStatus({ type, data }: { type: string; data: any }) {
  const isShopify = type === "integration_shopify";
  const title = isShopify ? "Shopify Integration" : "CRM Integration";
  // Mock data for demo purposes, since we don't have this in getDashboardData yet
  const enabled = isShopify ? true : true; 

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex items-center justify-between" data-testid={`widget-${type}`}>
      <div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Last synced: {new Date().toLocaleTimeString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {enabled ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 size={14} /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle size={14} /> Inactive
          </span>
        )}
      </div>
    </div>
  );
}
