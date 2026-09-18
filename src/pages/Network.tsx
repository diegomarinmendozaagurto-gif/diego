import type { LucideIcon } from "lucide-react";
import {
  Globe,
  Route,
  Zap,
  Network as NetworkIcon,
  LogIn,
  Layers,
  Server,
  Database,
  Lock,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

interface FlowNodeProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FlowNode({ icon: Icon, title, description }: FlowNodeProps) {
  return (
    <div className="app-card flex w-full shrink-0 flex-col items-center gap-3 text-center sm:w-48">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={24} strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-text-primary">{title}</p>
        <p className="mt-1 text-[12px] leading-snug text-text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center py-2 lg:px-1 lg:py-0">
      <ArrowDown size={22} className="shrink-0 text-primary lg:hidden" />
      <ArrowRight size={22} className="hidden shrink-0 text-primary lg:block" />
    </div>
  );
}

export default function Network() {
  return (
    <div className="space-y-6">
      <div className="app-card">
        <h2>Arquitectura de red</h2>
        <p className="mt-1 text-[13px] text-text-secondary">
          Recorrido del tráfico desde Internet hasta la base de datos dentro de la
          VPC.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center">
        <FlowNode
          icon={Globe}
          title="Internet"
          description="Origen del tráfico del usuario"
        />
        <FlowArrow />
        <FlowNode
          icon={Route}
          title="Route 53"
          description="Resolución de nombres de dominio (DNS)"
        />
        <FlowArrow />
        <FlowNode
          icon={Zap}
          title="CloudFront"
          description="CDN global: caché y distribución de contenido"
        />
        <FlowArrow />

        <div className="flex flex-1 flex-col rounded-card border-2 border-primary/30 bg-primary/5 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                <NetworkIcon size={18} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-text-primary">
                  VPC — Red privada aislada
                </p>
                <p className="text-[12px] text-text-secondary">
                  Amazon Virtual Private Cloud · us-east-1
                </p>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[12px] font-medium text-primary">
              10.0.0.0/16
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-card px-4 py-2">
              <LogIn size={16} className="text-primary" />
              <span className="text-[13px] font-medium text-text-primary">
                Internet Gateway
              </span>
            </div>
            <FlowArrow />
          </div>

          <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-primary" />
                  <p className="text-[13px] font-semibold text-text-primary">
                    Subred pública
                  </p>
                </div>
                <span className="text-[12px] font-medium text-text-secondary">
                  Con Internet
                </span>
              </div>
              <p className="mb-2 font-mono text-[11px] text-text-secondary">
                10.0.1.0/24
              </p>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Server size={16} />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-text-primary">
                    EC2
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    Cómputo de aplicación
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <FlowArrow />
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-security" />
                    <p className="text-[13px] font-semibold text-text-primary">
                      Subred privada
                    </p>
                  </div>
                  <span className="text-[12px] font-medium text-text-secondary">
                    Sin Internet
                  </span>
                </div>
                <p className="mb-2 font-mono text-[11px] text-text-secondary">
                  10.0.2.0/24
                </p>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Database size={16} />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-security text-white">
                      <Lock size={9} strokeWidth={3} />
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">RDS</p>
                    <p className="text-[11px] text-text-secondary">
                      Base de datos segura
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}