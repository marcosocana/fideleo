import { ArrowRight } from "lucide-react";

import type { Reward } from "@/lib/types/domain";

export function RewardTile({ reward }: { reward: Reward }) {
  return (
    <article className="card-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{reward.rewardType}</p>
          <h3 className="mt-2 text-lg font-semibold">{reward.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{reward.description}</p>
        </div>
        <div className="rounded-2xl bg-[color:var(--accent-soft)] px-3 py-2 text-sm font-semibold text-[color:var(--accent)]">
          {reward.pointsRequired} pts
        </div>
      </div>
      <button className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--accent)]">
        Solicitar canje
        <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
}
