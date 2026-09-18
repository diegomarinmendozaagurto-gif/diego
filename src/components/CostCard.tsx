import { DollarSign, Trash2 } from "lucide-react";
import type { CostItem } from "../types/cloud";

interface CostCardProps {
  item: CostItem;
  onRemove?: (id: string) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export default function CostCard({ item, onRemove }: CostCardProps) {
  const metrics = [
    { label: "Costo estimado", value: item.estimatedCost },
    { label: "Costo mensual", value: item.monthlyCost },
    { label: "Costo anual", value: item.annualCost },
  ];

  return (
    <article className="app-card flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cost/10 text-cost">
            <DollarSign size={18} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-text-primary">
              {item.serviceName}
            </p>
            <p className="text-[12px] text-text-secondary">
              Cantidad: {item.quantity} · Horas: {item.estimatedHours}
            </p>
          </div>
        </div>

        {onRemove && (
          <button
            type="button"
            aria-label={`Eliminar ${item.serviceName}`}
            onClick={() => onRemove(item.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-text-secondary transition-colors hover:border-alert/30 hover:bg-alert/5 hover:text-alert"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-background p-3">
        {metrics.map(({ label, value }) => (
          <div key={label}>
            <p className="text-[11px] uppercase tracking-wide text-text-secondary">
              {label}
            </p>
            <p className="mt-0.5 text-[15px] font-bold text-cost">
              {formatCurrency(value)}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}