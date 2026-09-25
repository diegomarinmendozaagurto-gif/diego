import type { DashboardSummary, SecurityIndicator } from "../types/cloud";

export const dashboardSummary: DashboardSummary = {
  servicesUsed: 12,
  selectedRegion: "us-east-1",
  monthlyCost: 1842.5,
  annualCost: 22110,
  securityStatus: "ok",
  cloudResources: 38,
  architectureStatus: "ok",
};

export const monthlyCostTrend = [
  { month: "Abr", cost: 1380 },
  { month: "May", cost: 1450 },
  { month: "Jun", cost: 1520 },
  { month: "Jul", cost: 1640 },
  { month: "Ago", cost: 1730 },
  { month: "Sep", cost: 1842 },
];

export const costDistribution = [
  { name: "Compute", value: 720, color: "#2563EB" },
  { name: "Storage", value: 410, color: "#10B981" },
  { name: "Network", value: 300, color: "#F59E0B" },
  { name: "Security", value: 180, color: "#8B5CF6" },
];

export const performanceTrend = [
  { month: "Abr", latency: 72, throughput: 58 },
  { month: "May", latency: 68, throughput: 64 },
  { month: "Jun", latency: 66, throughput: 71 },
  { month: "Jul", latency: 61, throughput: 75 },
  { month: "Ago", latency: 59, throughput: 79 },
  { month: "Sep", latency: 55, throughput: 83 },
];

export const securityIndicators: SecurityIndicator[] = [
  {
    id: "iam",
    title: "Cumplimiento IAM",
    description: "Roles y políticas aplicados correctamente",
    status: "ok",
  },
  {
    id: "audit",
    title: "Auditoría continua",
    description: "CloudTrail registrando toda la actividad",
    status: "ok",
  },
  {
    id: "vuln",
    title: "Vulnerabilidades",
    description: "2 hallazgos menores pendientes de remediación",
    status: "warning",
  },
];