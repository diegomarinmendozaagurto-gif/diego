import { Globe2, Server, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import RegionCard from "../components/RegionCard";
import type { StatusLevel } from "../types/cloud";
import { regions, regionPositions } from "../data/regions";
import { dashboardSummary } from "../data/dashboard";

const statusColor: Record<StatusLevel, string> = {
  ok: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
};

const statusLabel: Record<StatusLevel, string> = {
  ok: "Correcto",
  warning: "Requiere revisión",
  error: "Problema",
};

const statusOrder: StatusLevel[] = ["ok", "warning", "error"];

const worldLandmasses = [
  "M78 96L118 70L176 75L230 102L246 130L224 170L170 188L118 180L89 150L73 119Z",
  "M208 198L244 235L248 295L230 354L197 400L176 354L186 293L194 234Z",
  "M392 120L438 96L494 102L520 140L503 164L456 168L420 155L400 136Z",
  "M449 168L491 189L531 239L521 318L474 365L443 322L446 249L438 205Z",
  "M502 132L568 106L650 96L730 120L810 150L822 210L778 255L722 250L650 194L582 184L542 168Z",
  "M757 330L813 308L872 342L852 393L790 396L748 360Z",
];

export default function Infrastructure() {
  const activeRegionId = dashboardSummary.selectedRegion;
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    activeRegionId,
  );
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  const totalServices = new Set(regions.flatMap((r) => r.deployedServices)).size;
  const okCount = regions.filter((r) => r.status === "ok").length;

  const orderedRegions = useMemo(
    () =>
      [...regions].sort((a, b) => {
        const aPriority = a.id === selectedRegionId ? 1 : 0;
        const bPriority = b.id === selectedRegionId ? 1 : 0;
        return bPriority - aPriority;
      }),
    [selectedRegionId],
  );

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegionId(regionId);
    const target = document.getElementById(`region-card-${regionId}`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes regionPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.8;
          }
        }

        .region-marker-pulse {
          animation: regionPulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Globe2}
          label="Regiones desplegadas"
          value={regions.length}
          variant="primary"
        />
        <StatCard
          icon={Server}
          label="Servicios distintos"
          value={totalServices}
          variant="primary"
        />
        <StatCard
          icon={ShieldCheck}
          label="Regiones operativas"
          value={okCount}
          variant="security"
        />
      </div>

      <div className="app-card">
        <h2>Mapa de despliegue global</h2>
        <div className="relative mt-4 h-64 overflow-hidden rounded-xl bg-sidebar md:h-72">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <svg
            viewBox="0 0 900 450"
            className="absolute inset-0 h-full w-full"
            aria-label="Mapa mundial esquemático"
            role="img"
          >
            <g fill="#dfeafc" stroke="#a7bbd8" strokeWidth="1.2" opacity="0.9">
              {worldLandmasses.map((path, index) => (
                <path key={index} d={path} />
              ))}
            </g>
          </svg>

          {regions.map((region) => {
            const pos = regionPositions[region.region];
            if (!pos) return null;

            const isSelected = selectedRegionId === region.id;
            const isHovered = hoveredRegionId === region.id;
            const isPulsing = region.status === "warning" || region.status === "error";

            return (
              <div
                key={region.id}
                className="absolute"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <button
                  type="button"
                  aria-label={`Seleccionar ${region.region}`}
                  className="group relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  style={{
                    width: isSelected ? 30 : 18,
                    height: isSelected ? 30 : 18,
                    boxShadow: isSelected
                      ? `0 0 0 6px ${statusColor[region.status]}22`
                      : "none",
                  }}
                  onMouseEnter={() => setHoveredRegionId(region.id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                  onClick={() => handleRegionSelect(region.id)}
                >
                  <span
                    className={`block rounded-full border-2 border-white/80 ${
                      isPulsing ? "region-marker-pulse" : ""
                    }`}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: statusColor[region.status],
                      boxShadow:
                        region.status === "ok"
                          ? `0 0 0 2px ${statusColor[region.status]}22`
                          : `0 0 0 4px ${statusColor[region.status]}26`,
                    }}
                  />
                </button>

                {isHovered && (
                  <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border border-border bg-card/95 px-2.5 py-1.5 shadow-lg backdrop-blur-sm">
                    <p className="font-medium text-text-primary">{region.region}</p>
                    <p className="text-[11px] text-text-secondary">
                      {region.deployedServices.length} servicios desplegados
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          {statusOrder.map((status) => (
            <span
              key={status}
              className="flex items-center gap-1.5 text-[12px] text-text-secondary"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: statusColor[status] }}
              />
              {statusLabel[status]}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2>Regiones ({regions.length})</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {orderedRegions.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              isActive={selectedRegionId === region.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}