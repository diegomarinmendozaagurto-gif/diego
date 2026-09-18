import StatusBadge from "./StatusBadge";
import type { SecurityIndicator } from "../types/cloud";

interface SecurityCardProps {
  indicator: SecurityIndicator;
}

export default function SecurityCard({ indicator }: SecurityCardProps) {
  return (
    <article className="app-card flex flex-col gap-2.5 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[14px] font-semibold leading-snug text-text-primary">
          {indicator.title}
        </p>
        <StatusBadge status={indicator.status} />
      </div>
      <p className="text-[13px] leading-relaxed text-text-secondary">
        {indicator.description}
      </p>
    </article>
  );
}