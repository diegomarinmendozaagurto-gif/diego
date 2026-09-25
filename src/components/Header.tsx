import { useLocation } from "react-router-dom";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Resumen general de la solución Cloud" },
  "/planning": { title: "Planificación Cloud", subtitle: "Registro de propuestas de solución" },
  "/costs": { title: "Costos y economía Cloud", subtitle: "Estimación de costos por servicio" },
  "/infrastructure": { title: "Infraestructura Global", subtitle: "Regiones y servicios desplegados" },
  "/security": { title: "Seguridad", subtitle: "Responsabilidad compartida, IAM y cumplimiento" },
  "/network": { title: "Arquitectura de Red", subtitle: "Internet → Route 53 → CloudFront → VPC" },
  "/services": { title: "Servicios AWS", subtitle: "Catálogo de servicios utilizados" },
};

interface HeaderProps {
  onOpenMenu: () => void;
}

export default function Header({ onOpenMenu }: HeaderProps) {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const current = titles[pathname] ?? { title: "CloudOps Dashboard", subtitle: "" };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          aria-label="Abrir menú"
          onClick={onOpenMenu}
          className="text-text-secondary transition-colors hover:text-text-primary md:hidden"
        >
          <Menu size={22} strokeWidth={2} />
        </button>

        <div>
          <h1 className="text-[19px] font-semibold leading-none">{current.title}</h1>
          <p className="text-[13px] text-text-secondary mt-1 hidden sm:block">{current.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-[13px] text-text-secondary sm:inline">Región activa:</span>
        <span className="text-[13px] font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
          us-east-1
        </span>
        <button
          type="button"
          aria-label={isDark ? "Activar tema claro" : "Activar tema oscuro"}
          aria-pressed={isDark}
          title={isDark ? "Activar tema claro" : "Activar tema oscuro"}
          onClick={toggleTheme}
          className="hud-toggle inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-text-secondary transition-all hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          {isDark ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
        </button>
      </div>
    </header>
  );
}
