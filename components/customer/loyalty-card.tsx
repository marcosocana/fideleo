import { Gift, Sparkles } from "lucide-react";

import type { Membership } from "@/lib/types/domain";

export function LoyaltyCard({ membership }: { membership: Membership }) {
  const progress = Math.max(0, Math.min(100, ((45 - membership.pointsToNextReward) / 45) * 100));

  return (
    <section className="overflow-hidden rounded-[28px] bg-[#163B33] p-6 text-white shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/70">Mi saldo</p>
          <h1 className="mt-3 text-4xl font-semibold">{membership.currentPoints} pts</h1>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          Nivel {membership.currentTier}
        </span>
      </div>
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between text-sm text-white/80">
          <span>Siguiente recompensa</span>
          <span>{membership.pointsToNextReward} pts restantes</span>
        </div>
        <div className="h-2 rounded-full bg-white/15">
          <div className="h-2 rounded-full bg-[#C8873F]" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Gift className="h-4 w-4" />
          {membership.nextRewardTitle}
        </div>
      </div>
    </section>
  );
}
