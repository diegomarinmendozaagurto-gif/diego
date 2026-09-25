import { useState } from "react";
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
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { useTheme } from "../context/ThemeContext";
import {
  dashboardSummary,
  monthlyCostTrend,
  costDistribution,
  performanceTrend,
  securityIndicators,
} from "../data/dashboard";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatAxisCurrency = (value: number) => `$${Number(value).toLocaleString("en-US")}`;

const lightChartTheme = {
  grid: "#E2E8F0",
  axis: "#64748B",
  cursor: "#F1F5F9",
  bar: "#2563EB",
  barStroke: "#2563EB",
  tooltipBackground: "#FFFFFF",
  tooltipBorder: "#E2E8F0",
  tooltipText: "#1E293B",
};

const darkChartTheme = {
  grid: "#1E3A52",
  axis: "#94B3C7",
  cursor: "rgba(34, 211, 238, 0.08)",
  bar: "#22D3EE",
  barStroke: "#3B82F6",
  tooltipBackground: "#0B1622",
  tooltipBorder: "#1E3A52",
  tooltipText: "#E2F2FC",
};

export default function Dashboard() {
  const { isDark } = useTheme();
  const chartTheme = isDark ? darkChartTheme : lightChartTheme;
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);

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
                  strokeDasharray="0"
                  stroke="#F1F5F9"
                  vertical={false}
                  horizontal={true}
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
                  tickFormatter={(value: number | string) => formatAxisCurrency(Number(value))}
                />
                <Tooltip
                  cursor={{ fill: chartTheme.cursor }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    color: "#1E293B",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
                  }}
                  labelStyle={{ color: "#1E293B", fontWeight: 600 }}
                  itemStyle={{ color: "#1E293B" }}
                  formatter={(value) => [
                    formatAxisCurrency(Number(value)),
                    "Costo",
                  ]}
                />
                <Bar
                  dataKey="cost"
                  fill={chartTheme.bar}
                  stroke={chartTheme.barStroke}
                  strokeWidth={1}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                >
                  <LabelList
                    dataKey="cost"
                    position="top"
                    formatter={(value: number | string) => formatAxisCurrency(Number(value))}
                    style={{ fill: "#64748B", fontSize: 12, fontWeight: 600 }}
                  />
                  {monthlyCostTrend.map((entry, index) => (
                    <Cell
                      key={`${entry.month}-bar`}
                      fill={chartTheme.bar}
                      opacity={activeBarIndex === index ? 0.85 : 1}
                      onMouseEnter={() => setActiveBarIndex(index)}
                      onMouseLeave={() => setActiveBarIndex(null)}
                    />
                  ))}
                </Bar>
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
                className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="app-card">
          <h2>Distribución de costos</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={78}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {costDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), "Gasto"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="app-card xl:col-span-2">
          <h2>Latencia y throughput</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceTrend}
                margin={{ top: 8, right: 12, bottom: 0, left: -12 }}
              >
                <CartesianGrid
                  stroke="#F1F5F9"
                  strokeDasharray="0"
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
                  }}
                  formatter={(value) => [`${value} ms`, "Valor"]}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="throughput"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}