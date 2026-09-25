import { useEffect, useMemo, useState } from "react";
import {
  X,
  Gauge,
  Lightbulb,
  Link2,
  MousePointerClick,
} from "lucide-react";
import type { AWSService, ComplexityLevel } from "../types/cloud";
import { awsServices } from "../data/awsServices";
import StatusBadge from "./StatusBadge";
import { categoryColors, categoryIcons } from "./ServiceCard";

const complexityStyles: Record<ComplexityLevel, string> = {
  Básico: "bg-primary/10 text-primary",
  Intermedio: "bg-cost/10 text-cost",
  Avanzado: "bg-alert/10 text-alert",
};

interface ServiceDetailModalProps {
  service: AWSService;
  onClose: () => void;
  onSelectService: (name: string) => void;
}

export default function ServiceDetailModal({
  service,
  onClose,
  onSelectService,
}: ServiceDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  const Icon = categoryIcons[service.category];
  const CategoryIcon = categoryIcons[service.category];
  const iconColor = categoryColors[service.category];

  const related = useMemo(
    () =>
      service.relatedServices
        .map((id) => awsServices.find((s) => s.id === id))
        .filter((s): s is AWSService => Boolean(s)),
    [service]
  );

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 200);
  };

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const overlayVisible = !closing && mounted;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-200 sm:items-center sm:p-4 ${
        overlayVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={requestClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle de ${service.name}`}
    >
      <div className="absolute inset-0 bg-sidebar/60 backdrop-blur-sm" />

      <div
        className={`relative max-h-[88vh] w-full overflow-y-auto rounded-t-panel border border-border bg-card p-5 shadow-2xl transition-all duration-200 ease-out dark:border-electric/40 dark:shadow-hud sm:max-w-lg sm:rounded-panel ${
          overlayVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={requestClose}
          aria-label="Cerrar detalle"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-text-secondary transition-colors hover:border-alert/40 hover:text-alert"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sidebar/5 ${iconColor}`}
          >
            <Icon size={22} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="pr-8 text-[18px] font-bold leading-tight text-text-primary">
              {service.name}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-text-secondary">
              <CategoryIcon
                size={12}
                strokeWidth={2.5}
                className={iconColor}
              />
              {service.category}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={service.status} />
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${complexityStyles[service.complexity]}`}
          >
            <Gauge size={14} strokeWidth={2.5} />
            Complejidad: {service.complexity}
          </span>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-text-secondary">
          {service.description}
        </p>

        <div className="mt-4 rounded-lg border border-border bg-background px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-wide text-text-secondary">
            Función principal
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-text-primary">
            {service.mainFunction}
          </p>
        </div>

        <div className="mt-3 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
          <Lightbulb
            size={16}
            className="mt-0.5 shrink-0 text-primary"
            strokeWidth={2.2}
          />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-text-secondary">
              Caso de uso típico
            </p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-text-primary">
              {service.useCase}
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-4">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
              <Link2 size={14} />
              Servicios relacionados
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {related.map((item) => {
                const RelatedIcon = categoryIcons[item.category];
                const relatedColor = categoryColors[item.category];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectService(item.name)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-medium text-text-primary transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    <RelatedIcon
                      size={13}
                      strokeWidth={2.5}
                      className={relatedColor}
                    />
                    {item.name}
                    <MousePointerClick
                      size={12}
                      className="text-text-secondary"
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-text-secondary">
              Hacé clic en un servicio relacionado para filtrar el catálogo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}