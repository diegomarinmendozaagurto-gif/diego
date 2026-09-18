import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { StatusLevel } from "../types/cloud";

interface StatusBadgeProps {
  status: StatusLevel;
  label?: string;
}

const config: Record<StatusLevel, { color: string; bg: string; text: string; Icon: typeof CheckCircle2 }> = {
  ok: { color: "#16A34A", bg: "#F0FDF4", text: "Correcto", Icon: CheckCircle2 },
  warning: { color: "#F59E0B", bg: "#FFFBEB", text: "Requiere revisión", Icon: AlertTriangle },
  error: { color: "#DC2626", bg: "#FEF2F2", text: "Problema", Icon: XCircle },
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
