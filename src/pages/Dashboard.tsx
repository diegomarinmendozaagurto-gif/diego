import {
  Server,
  Globe2,
  DollarSign,
  CalendarRange,
  ShieldCheck,
  Cpu,
  Network,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import {
  dashboardSummary,
  monthlyCostTrend,
  securityIndicators,
} from "../data/dashboard";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          icon={Server}
          label="Servicios utilizados"
          value={dashboardSummary.servicesUsed}
          variant="primary"
        />
        <StatCard
          icon={Globe2}
          label="Región seleccionada"
          value={dashboardSummary.selectedRegion}
          variant="primary"
        />
        <StatCard
          icon={DollarSign}
          label="Costo mensual estimado"
          value={formatCurrency(dashboardSummary.monthlyCost)}
          variant="cost"
        />
        <StatCard
          icon={CalendarRange}
          label="Costo anual estimado"
          value={formatCurrency(dashboardSummary.annualCost)}
          variant="cost"
        />
        <StatCard
          icon={ShieldCheck}
          label="Estado de seguridad"
          value={<StatusBadge status={dashboardSummary.securityStatus} />}
          variant="security"
        />
        <StatCard
          icon={Cpu}
          label="Recursos Cloud"
          value={dashboardSummary.cloudResources}
          variant="primary"
        />
        <StatCard
          icon={Network}
          label="Estado de la arquitectura"
          value={<StatusBadge status={dashboardSummary.architectureStatus} />}
          variant="alert"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="app-card lg:col-span-2">
          <h2>Costo mensual — últimos 6 meses</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyCostTrend}
                margin={{ top: 4, right: 4, bottom: 0, left: -12 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: "#E2E8F0" }}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  cursor={{ fill: "#F1F5F9" }}
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Costo",
                  ]}
                />
                <Bar
                  dataKey="cost"
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="app-card">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-security" />
            <h2>Resumen de seguridad</h2>
          </div>
          <ul className="space-y-3">
            {securityIndicators.map(({ id, title, description, status }) => (
              <li
                key={id}
                className="flex items-start justify-between gap-3 rounded-xl border border-border p-3"
              >
                <div>
                  <p className="font-medium text-text-primary">{title}</p>
                  <p className="mt-0.5 text-[12px] text-text-secondary">
                    {description}
                  </p>
                </div>
                <StatusBadge status={status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}