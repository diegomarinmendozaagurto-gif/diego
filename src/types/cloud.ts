// Estados posibles para los indicadores tipo semáforo (verde/amarillo/rojo)
// que pide la consigna en Seguridad, Infraestructura y Servicios.
export type StatusLevel = "ok" | "warning" | "error";

export type ComplexityLevel = "Básico" | "Intermedio" | "Avanzado";

export interface AWSService {
  id: string;
  name: string;
  category: "Cómputo" | "Almacenamiento" | "Base de datos" | "Redes" | "Seguridad";
  description: string;
  mainFunction: string;
  status: StatusLevel;
  useCase: string;
  complexity: ComplexityLevel;
  relatedServices: string[];
}

export interface Region {
  id: string;
  region: string; // ej. "us-east-1"
  location: string; // ej. "Virginia, EE.UU."
  lat: number;
  lng: number;
  deployedServices: string[];
  status: StatusLevel;
  load?: number; // 20-90, simulado para uso de la región
  latency?: string; // ej. "42ms", "120-180ms"
}

export interface CloudProposal {
  id: string;
  solutionName: string;
  appType: string;
  description: string;
  region: string;
  estimatedUsers: number;
  availabilityLevel: "Básica" | "Alta" | "Crítica";
  selectedServices: string[];
  migrationGoal: string;
  createdAt: string;
}

export interface CostItem {
  id: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  estimatedHours: number;
  estimatedCost: number;
  monthlyCost: number;
  annualCost: number;
}

export interface SecurityIndicator {
  id: string;
  title: string;
  description: string;
  status: StatusLevel;
}

// Resumen que consume el Dashboard (Módulo 1)
export interface DashboardSummary {
  servicesUsed: number;
  selectedRegion: string;
  monthlyCost: number;
  annualCost: number;
  securityStatus: StatusLevel;
  cloudResources: number;
  architectureStatus: StatusLevel;
}
