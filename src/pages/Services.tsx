import { useMemo, useState } from "react";
import {
  Search,
  Server,
  LayoutGrid,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import ServiceCard from "../components/ServiceCard";
import ServiceDetailModal from "../components/ServiceDetailModal";
import StatCard from "../components/StatCard";
import type { AWSService } from "../types/cloud";
import { awsServices } from "../data/awsServices";

const CATEGORIES: Array<AWSService["category"] | "Todas"> = [
  "Todas",
  "Cómputo",
  "Almacenamiento",
  "Base de datos",
  "Redes",
  "Seguridad",
];

const CATEGORY_COLORS: Record<AWSService["category"], string> = {
  Cómputo: "#2563EB",
  Almacenamiento: "#F59E0B",
  "Base de datos": "#16A34A",
  Redes: "#0F172A",
  Seguridad: "#DC2626",
};

interface CategoryTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  total: number;
}

function CategoryTooltip({ active, payload, total }: CategoryTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  const percent = total > 0 ? Math.round((entry.value / total) * 100) : 0;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-[12px] shadow-lg">
      <p className="font-semibold text-text-primary">{entry.name}</p>
      <p className="text-text-secondary">
        {entry.value} servicio{entry.value === 1 ? "" : "s"} · {percent}%
      </p>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-text-secondary";

export default function Services() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<AWSService["category"] | "Todas">(
    "Todas"
  );
  const [selectedService, setSelectedService] = useState<AWSService | null>(
    null
  );

  const stats = useMemo(
    () => ({
      total: awsServices.length,
      ok: awsServices.filter((s) => s.status === "ok").length,
      warning: awsServices.filter((s) => s.status === "warning").length,
      error: awsServices.filter((s) => s.status === "error").length,
    }),
    []
  );

  const categoryData = useMemo(() => {
    const counts = new Map<AWSService["category"], number>();
    for (const service of awsServices) {
      counts.set(service.category, (counts.get(service.category) ?? 0) + 1);
    }
    return CATEGORIES.filter(
      (cat): cat is AWSService["category"] => cat !== "Todas"
    ).map((cat) => ({
      category: cat,
      name: cat,
      value: counts.get(cat) ?? 0,
    }));
  }, []);

  const handleCategoryClick = (cat: AWSService["category"]) => {
    setCategory((prev) => (prev === cat ? "Todas" : cat));
  };

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return awsServices.filter((service) => {
      const matchesQuery =
        normalized === "" ||
        service.name.toLowerCase().includes(normalized);
      const matchesCategory =
        category === "Todas" || service.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-4">
          <StatCard
            icon={LayoutGrid}
            label="Servicios totales"
            value={stats.total}
            variant="primary"
          />
          <StatCard
            icon={CheckCircle2}
            label="Estado correcto"
            value={stats.ok}
            variant="security"
          />
          <StatCard
            icon={AlertTriangle}
            label="Requieren revisión"
            value={stats.warning}
            variant="cost"
          />
          <StatCard
            icon={XCircle}
            label="Con problemas"
            value={stats.error}
            variant="alert"
          />
        </div>

        <div className="app-card">
          <div className="mb-4 flex items-center gap-2">
            <PieChartIcon size={18} className="text-primary" />
            <h2>Distribución por categoría</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke="#FFFFFF"
                  cursor="pointer"
                  onClick={(_, index) => {
                    const entry = categoryData[index];
                    if (entry) handleCategoryClick(entry.category);
                  }}
                >
                  {categoryData.map((entry) => {
                    const isActive =
                      category === "Todas" || category === entry.category;
                    return (
                      <Cell
                        key={entry.category}
                        fill={CATEGORY_COLORS[entry.category]}
                        opacity={isActive ? 1 : 0.3}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  content={<CategoryTooltip total={stats.total} />}
                />
                <Legend
                  iconType="circle"
                  formatter={(label) => (
                    <span style={{ color: "#1E293B", fontSize: 13 }}>
                      {label}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[11px] text-text-secondary">
            Hacé clic sobre una categoría para filtrar el listado. Volvé a
            hacer clic para mostrar todas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            className={`${inputClass} pl-10`}
            placeholder="Buscar servicio por nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:col-span-3 lg:col-span-3">
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-text-secondary hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Server size={20} className="text-primary" />
        <h2>
          Mostrando {filtered.length} de {awsServices.length}{" "}
          {awsServices.length === 1 ? "servicio" : "servicios"}
        </h2>
      </div>

      {filtered.length === 0 ? (
        <div className="app-card">
          <p className="text-text-secondary">
            No hay servicios que coincidan con tu búsqueda o filtro. Probá
            ajustar los criterios.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onOpen={() => setSelectedService(service)}
            />
          ))}
        </div>
      )}

      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onSelectService={(name) => {
            setQuery(name);
            setCategory("Todas");
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}