import type { LucideIcon } from "lucide-react";
import {
  Building2,
  KeyRound,
  UserCheck,
  Lock,
  BadgeCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import StatCard from "../components/StatCard";
import SecurityCard from "../components/SecurityCard";
import { securitySections } from "../data/security";

const sectionIcons: Record<string, LucideIcon> = {
  responsability: Building2,
  iam: KeyRound,
  accounts: UserCheck,
  data: Lock,
  compliance: BadgeCheck,
};

export default function Security() {
  const allIndicators = securitySections.flatMap((section) => section.indicators);
  const okCount = allIndicators.filter((i) => i.status === "ok").length;
  const warningCount = allIndicators.filter((i) => i.status === "warning").length;
  const errorCount = allIndicators.filter((i) => i.status === "error").length;
  const compliancePercent = Math.round((okCount / allIndicators.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <div className="app-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2>Resumen de seguridad</h2>
              <p className="mt-1 text-[13px] text-text-secondary">
                {okCount} de {allIndicators.length} controles correctos ·{" "}
                {compliancePercent}% de cumplimiento
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-security/10 px-3 py-1 text-[13px] font-semibold text-security">
                {okCount} correctos
              </span>
              <span className="rounded-full bg-cost/10 px-3 py-1 text-[13px] font-semibold text-cost">
                {warningCount} revisar
              </span>
              <span className="rounded-full bg-alert/10 px-3 py-1 text-[13px] font-semibold text-alert">
                {errorCount} problemas
              </span>
            </div>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full border border-border bg-background">
            <div
              className="h-full rounded-full bg-security transition-all"
              style={{ width: `${compliancePercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={CheckCircle2}
          label="Controles correctos"
          value={okCount}
          variant="security"
        />
        <StatCard
          icon={AlertTriangle}
          label="Requieren revisión"
          value={warningCount}
          variant="cost"
        />
        <StatCard
          icon={XCircle}
          label="Problemas"
          value={errorCount}
          variant="alert"
        />
      </div>

      <div className="space-y-6">
        {securitySections.map((section) => {
          const Icon = sectionIcons[section.id] ?? KeyRound;
          return (
            <section key={section.id}>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <h2>{section.title}</h2>
                  <p className="text-[13px] text-text-secondary">
                    {section.description}
                  </p>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
                  section.indicators.length > 2 ? "xl:grid-cols-3" : ""
                }`}
              >
                {section.indicators.map((indicator) => (
                  <SecurityCard key={indicator.id} indicator={indicator} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}