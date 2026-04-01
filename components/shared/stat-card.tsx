import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import type { Kpi } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: ArrowRight
};

export function StatCard({ label, value, trend, trendDirection = "flat" }: Kpi) {
  const Icon = trendIcon[trendDirection];

  return (
    <div className="card-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
              trendDirection === "up" && "bg-emerald-50 text-emerald-700",
              trendDirection === "down" && "bg-rose-50 text-rose-700",
              trendDirection === "flat" && "bg-slate-100 text-slate-600"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {trend}
          </span>
        ) : null}
      </div>
    </div>
  );
}
