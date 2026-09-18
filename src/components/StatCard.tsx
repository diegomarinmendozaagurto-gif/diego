import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type StatVariant = "primary" | "security" | "cost" | "alert";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  variant?: StatVariant;
}

const variants: Record<StatVariant, string> = {
  primary: "bg-primary/10 text-primary",
  security: "bg-security/10 text-security",
  cost: "bg-cost/10 text-cost",
  alert: "bg-alert/10 text-alert",
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  variant = "primary",
}: StatCardProps) {
  return (
    <div className="app-card flex items-center gap-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${variants[variant]}`}
      >
        <Icon size={22} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="text-[12px] uppercase tracking-wide text-text-secondary">
          {label}
        </p>
        <div className="mt-0.5 truncate text-[22px] font-bold leading-tight text-text-primary">
          {value}
        </div>
      </div>
    </div>
  );
}