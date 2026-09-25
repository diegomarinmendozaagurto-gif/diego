import { Globe2, Server, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import GlobeVisualization from "../components/GlobeVisualization";
import RegionCard from "../components/RegionCard";
import StatCard from "../components/StatCard";
import { useTheme } from "../context/ThemeContext";
import { regions } from "../data/regions";
import { dashboardSummary } from "../data/dashboard";

export default function Infrastructure() {
  const { isDark } = useTheme();
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    dashboardSummary.selectedRegion,
  );

  const orderedRegions = useMemo(
    () => [...regions].sort((a, b) => {
      const aPriority = a.id === selectedRegionId ? 1 : 0;
      const bPriority = b.id === selectedRegionId ? 1 : 0;
      return bPriority - aPriority;
    }),
    [selectedRegionId],
  );

  const totalServices = new Set(regions.flatMap((region) => region.deployedServices)).size;
  const okCount = regions.filter((region) => region.status === "ok").length;

  return (
    <div className="space-y-6">
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

      <div className="app-card overflow-hidden">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2>Monitoreo global</h2>
          {selectedRegionId && (
            <button
              type="button"
              onClick={() => setSelectedRegionId(null)}
              className="rounded-md border border-border bg-background px-2.5 py-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:text-primary"
            >
              Volver a vista global
            </button>
          )}
        </div>

        <div className="rounded-xl border border-border bg-background/40">
          <GlobeVisualization
            regions={regions}
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
            isDark={isDark}
          />
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