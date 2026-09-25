import { ArrowRightLeft, Globe2, MapPinned } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Region } from "../types/cloud";

interface RegionCardProps {
  region: Region;
  isActive?: boolean;
}

const flagByRegion: Record<string, string> = {
  "us-east-1": "🇺🇸",
  "us-west-2": "🇺🇸",
  "sa-east-1": "🇧🇷",
  "eu-west-1": "🇮🇪",
  "eu-central-1": "🇩🇪",
  "ap-southeast-1": "🇸🇬",
};

const statusColor: Record<Region["status"], string> = {
  ok: "var(--status-ok)",
  warning: "var(--status-warning)",
  error: "var(--status-error)",
};

export default function RegionCard({ region, isActive = false }: RegionCardProps) {
  const load = region.load ?? { "us-east-1": 72, "us-west-2": 54, "sa-east-1": 63, "eu-west-1": 66, "eu-central-1": 58, "ap-southeast-1": 81 }[region.id] ?? 60;
  const latency = region.latency ?? (region.id === "us-east-1" ? "42ms" : region.id === "ap-southeast-1" ? "128-180ms" : "72-110ms");

  return (
    <article
      id={`region-card-${region.id}`}
      className={`app-card flex flex-col gap-3 transition-all duration-200 ${
        isActive
          ? "hud-active border-primary/80 bg-primary/[0.02]"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="text-lg" aria-label={`Bandera de ${region.location}`}>
              {flagByRegion[region.id] ?? "🌍"}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-mono text-[14px] font-semibold text-text-primary">
                {region.region}
              </p>
              {isActive && (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  Activa
                </span>
              )}
            </div>
            <p className="text-[12px] text-text-secondary">{region.location}</p>
          </div>
        </div>
        <StatusBadge status={region.status} />
      </div>

      <div className="space-y-2 rounded-lg border border-border bg-background/70 p-2.5">
        <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-wide text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <Globe2 size={12} strokeWidth={2.1} />
            Carga simulado
          </span>
          <span className="font-semibold text-text-primary">{load}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${load}%`, backgroundColor: statusColor[region.status] }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/70 px-2.5 py-2">
        <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
          <ArrowRightLeft size={12} strokeWidth={2.1} />
          Latencia
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
          {latency}
        </span>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2 text-[11px] uppercase tracking-wide text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <MapPinned size={12} strokeWidth={2.1} />
            Servicios
          </span>
          <span>{region.deployedServices.length}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {region.deployedServices.map((service) => (
            <span
              key={service}
              className="rounded-full border border-border bg-background px-2 py-1 text-[11px] font-medium text-text-primary shadow-sm dark:shadow-none"
            >
              {service}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}