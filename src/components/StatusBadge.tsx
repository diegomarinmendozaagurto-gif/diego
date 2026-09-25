import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { StatusLevel } from "../types/cloud";

interface StatusBadgeProps {
  status: StatusLevel;
  label?: string;
}

const config: Record<StatusLevel, { color: string; bg: string; text: string; Icon: typeof CheckCircle2 }> = {
  ok: { color: "var(--status-ok)", bg: "var(--status-ok-bg)", text: "Correcto", Icon: CheckCircle2 },
  warning: { color: "var(--status-warning)", bg: "var(--status-warning-bg)", text: "Requiere revisión", Icon: AlertTriangle },
  error: { color: "var(--status-error)", bg: "var(--status-error-bg)", text: "Problema", Icon: XCircle },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const { color, bg, text, Icon } = config[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium"
      style={{ backgroundColor: bg, color }}
    >
      <Icon size={14} strokeWidth={2.5} />
      {label ?? text}
    </span>
  );
}
