import type { LucideIcon } from "lucide-react";
import {
  Server,
  HardDrive,
  Database,
  KeyRound,
  Network,
  Route,
  Zap,
  Braces,
  Activity,
  ChevronRight,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { AWSService } from "../types/cloud";

const serviceIcons: Record<string, LucideIcon> = {
  EC2: Server,
  S3: HardDrive,
  RDS: Database,
  IAM: KeyRound,
  VPC: Network,
  "Route 53": Route,
  CloudFront: Zap,
  Lambda: Braces,
  DynamoDB: Database,
  CloudWatch: Activity,
};

export const categoryIcons: Record<AWSService["category"], LucideIcon> = {
  Cómputo: Server,
  Almacenamiento: HardDrive,
  "Base de datos": Database,
  Redes: Network,
  Seguridad: KeyRound,
};

export const categoryColors: Record<AWSService["category"], string> = {
  Cómputo: "text-primary",
  Almacenamiento: "text-cost",
  "Base de datos": "text-security",
  Redes: "text-sidebar",
  Seguridad: "text-alert",
};

interface ServiceCardProps {
  service: AWSService;
  onOpen?: () => void;
}

export default function ServiceCard({ service, onOpen }: ServiceCardProps) {
  const Icon = serviceIcons[service.name] ?? categoryIcons[service.category];
  const CategoryIcon = categoryIcons[service.category];

  return (
    <article
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      onClick={onOpen}
      onKeyDown={(e) => {
        if (onOpen && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      }}
      className="app-card group flex cursor-pointer flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon size={18} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-text-primary">
              {service.name}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-text-secondary">
              <CategoryIcon
                size={12}
                strokeWidth={2.5}
                className={categoryColors[service.category]}
              />
              {service.category}
            </span>
          </div>
        </div>
        <StatusBadge status={service.status} />
      </div>

      <p className="text-[13px] leading-relaxed text-text-secondary">
        {service.description}
      </p>

      <div className="rounded-lg border border-border bg-background px-3 py-2.5">
        <p className="text-[11px] uppercase tracking-wide text-text-secondary">
          Función principal
        </p>
        <p className="mt-0.5 text-[13px] font-medium text-text-primary">
          {service.mainFunction}
        </p>
      </div>

      <p className="mt-auto flex items-center gap-1.5 text-[12px] font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        Ver detalle
        <ChevronRight size={14} />
      </p>
    </article>
  );
}