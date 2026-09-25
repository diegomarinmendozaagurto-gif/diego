import { useMemo, useState } from "react";
import {
  Calculator,
  DollarSign,
  CalendarRange,
  PlusCircle,
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
import CostCard from "../components/CostCard";
import StatusBadge from "../components/StatusBadge";
import { useTheme } from "../context/ThemeContext";
import type { CostItem } from "../types/cloud";

const MOCK_SERVICES = [
  { id: "ec2", name: "EC2", hourlyCost: 0.046 },
  { id: "s3", name: "S3", hourlyCost: 0.023 },
  { id: "rds", name: "RDS", hourlyCost: 0.15 },
  { id: "lambda", name: "Lambda", hourlyCost: 0.0000167 },
  { id: "cloudfront", name: "CloudFront", hourlyCost: 0.0012 },
];

const LIGHT_CHART_COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626", "#0F172A"];
const DARK_CHART_COLORS = ["#22D3EE", "#3B82F6", "#34D399", "#FBBF24", "#FB7185"];

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1 block text-[13px] font-medium text-text-secondary";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export default function Costs() {
  const { isDark } = useTheme();
  const [serviceId, setServiceId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState(2500);
  const [estimates, setEstimates] = useState<CostItem[]>([]);

  const selectedService = MOCK_SERVICES.find((s) => s.id === serviceId);
  const qty = Number(quantity) > 0 ? Number(quantity) : 0;
  const hours = Number(estimatedHours) > 0 ? Number(estimatedHours) : 0;

  const calculated = useMemo(() => {
    const rate = selectedService?.hourlyCost ?? 0;
    const estimatedCost = rate * hours * qty;
    const monthlyCost = estimatedCost * 30;
    return {
      rate,
      estimatedCost,
      monthlyCost,
      annualCost: monthlyCost * 12,
    };
  }, [selectedService, hours, qty]);

  const isValid = Boolean(selectedService) && qty > 0 && hours > 0;

  const handleAdd = () => {
    if (!isValid || !selectedService) return;
    const item: CostItem = {
      id: crypto.randomUUID(),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      quantity: qty,
      estimatedHours: hours,
      estimatedCost: calculated.estimatedCost,
      monthlyCost: calculated.monthlyCost,
      annualCost: calculated.annualCost,
    };
    setEstimates((prev) => [...prev, item]);
  };

  const handleRemove = (id: string) => {
    setEstimates((prev) => prev.filter((item) => item.id !== id));
  };

  const totals = useMemo(() => {
    const monthly = estimates.reduce((sum, e) => sum + e.monthlyCost, 0);
    return { monthly, annual: monthly * 12 };
  }, [estimates]);

  const usagePercent = monthlyBudget > 0 ? (totals.monthly / monthlyBudget) * 100 : 0;
  const budgetProgress = Math.min(usagePercent, 100);
  const budgetStatus =
    usagePercent < 70 ? "security" : usagePercent < 90 ? "cost" : "alert";
  const budgetColor =
    budgetStatus === "security"
      ? "var(--status-ok)"
      : budgetStatus === "cost"
        ? "var(--status-warning)"
        : "var(--status-error)";
  const remainingBudget = monthlyBudget - totals.monthly;
  const isOverBudget = totals.monthly > monthlyBudget;

  const chartData = useMemo(() => {
    const byService = new Map<string, number>();
    for (const estimate of estimates) {
      byService.set(
        estimate.serviceName,
        (byService.get(estimate.serviceName) ?? 0) + estimate.monthlyCost
      );
    }
    return Array.from(byService, ([name, value]) => ({ name, value }));
  }, [estimates]);

  return (
    <div className="space-y-6">
      <div className="app-card hud-active border-primary/10 bg-primary/[0.02]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <DollarSign size={18} className="text-primary" />
              <h2>Presupuesto mensual objetivo</h2>
            </div>
            <p className="text-[13px] text-text-secondary">
              Controla el gasto total del proyecto frente a la estimación acumulada.
            </p>
          </div>

          <div className="w-full max-w-xs">
            <label htmlFor="monthlyBudget" className={labelClass}>
              Presupuesto mensual
            </label>
            <input
              id="monthlyBudget"
              type="number"
              min={0}
              step={50}
              className={inputClass}
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between gap-3 text-[13px] text-text-secondary">
            <span>Uso del presupuesto</span>
            <span className="font-semibold text-text-primary">
              {formatCurrency(totals.monthly)} / {formatCurrency(monthlyBudget)}
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${budgetProgress}%`, backgroundColor: budgetColor }}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] text-text-secondary">
              {Math.min(usagePercent, 100).toFixed(0)}% del objetivo utilizado
            </p>
            {isOverBudget ? (
              <div className="flex items-center gap-2">
                <StatusBadge status="error" label="Presupuesto excedido" />
                <span className="text-[12px] font-medium text-alert">
                  {formatCurrency(Math.abs(remainingBudget))}
                </span>
              </div>
            ) : (
              <span className="text-[12px] font-medium text-security">
                {formatCurrency(Math.max(remainingBudget, 0))} restantes
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="app-card lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <Calculator size={18} className="text-cost" />
            <h2>Estimación de costos</h2>
          </div>

          <form
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
          >
            <div className="sm:col-span-3">
              <label className={labelClass} htmlFor="service">
                Servicio *
              </label>
              <select
                id="service"
                className={inputClass}
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                <option value="">Seleccioná un servicio...</option>
                {MOCK_SERVICES.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} · {formatCurrency(service.hourlyCost)}/hora
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="quantity">
                Cantidad
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                className={inputClass}
                placeholder="Ej. 3"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="hours">
                Horas estimadas
              </label>
              <input
                id="hours"
                type="number"
                min={1}
                className={inputClass}
                placeholder="Ej. 150"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={!isValid}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 dark:text-background"
              >
                <PlusCircle size={18} />
                Agregar estimación
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="app-card">
            <div className="mb-3 flex items-center gap-2">
              <DollarSign size={18} className="text-cost" />
              <p className="font-semibold text-text-primary">Cálculo automático</p>
            </div>
            <dl className="space-y-2 text-[14px]">
              <div className="flex items-center justify-between">
                <dt className="text-text-secondary">Costo por hora</dt>
                <dd className="font-medium text-text-primary">
                  {formatCurrency(calculated.rate)}
                </dd>
              </div>
              <div className="circuit-divider flex items-center justify-between pt-2">
                <dt className="text-text-secondary">Costo estimado</dt>
                <dd className="font-semibold text-text-primary">
                  {formatCurrency(calculated.estimatedCost)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-text-secondary">Costo mensual (×30)</dt>
                <dd className="font-semibold text-cost">
                  {formatCurrency(calculated.monthlyCost)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-text-secondary">Costo anual (×12)</dt>
                <dd className="font-semibold text-cost">
                  {formatCurrency(calculated.annualCost)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="app-card">
            <div className="mb-3 flex items-center gap-2">
              <CalendarRange size={18} className="text-cost" />
              <p className="font-semibold text-text-primary">Totales estimados</p>
            </div>
            <dl className="space-y-2 text-[14px]">
              <div className="flex items-center justify-between">
                <dt className="text-text-secondary">Mensual</dt>
                <dd className="font-bold text-cost">
                  {formatCurrency(totals.monthly)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-text-secondary">Anual</dt>
                <dd className="font-bold text-cost">
                  {formatCurrency(totals.annual)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <PlusCircle size={20} className="text-primary" />
            <h2>Estimaciones registradas ({estimates.length})</h2>
          </div>

          {estimates.length === 0 ? (
            <div className="app-card">
              <p className="text-text-secondary">
                Aún no hay estimaciones. Completá el formulario y agregá la primera
                para empezar a calcular los costos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {estimates.map((item) => (
                <CostCard key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </div>
          )}
        </div>

        <div className="app-card">
          <div className="mb-4 flex items-center gap-2">
            <PieChartIcon size={18} className="text-primary" />
            <h2>Distribución por servicio</h2>
          </div>

          {chartData.length === 0 ? (
            <p className="text-text-secondary">
              Agregá estimaciones para ver la distribución de costos por servicio.
            </p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={88}
                    paddingAngle={2}
                    stroke={isDark ? "#0B1622" : "#FFFFFF"}
                  >
                    {chartData.map((entry, index) => {
                      const colors = isDark ? DARK_CHART_COLORS : LIGHT_CHART_COLORS;
                      return (
                        <Cell
                          key={entry.name}
                          fill={colors[index % colors.length]}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#0B1622" : "#FFFFFF",
                      border: `1px solid ${isDark ? "#1E3A52" : "#E2E8F0"}`,
                      borderRadius: 8,
                      color: isDark ? "#E2F2FC" : "#1E293B",
                    }}
                    labelStyle={{ color: isDark ? "#E2F2FC" : "#1E293B" }}
                    itemStyle={{ color: isDark ? "#E2F2FC" : "#1E293B" }}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend
                    iconType="circle"
                    formatter={(label) => (
                      <span
                        style={{
                          color: isDark ? "#E2F2FC" : "#1E293B",
                          fontSize: 13,
                        }}
                      >
                        {label}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}