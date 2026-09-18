import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  DollarSign,
  Globe2,
  ShieldCheck,
  Network,
  Server,
  Cloud,
  X,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planning", label: "Planificación", icon: ClipboardList },
  { to: "/costs", label: "Costos", icon: DollarSign },
  { to: "/infrastructure", label: "Infraestructura", icon: Globe2 },
  { to: "/security", label: "Seguridad", icon: ShieldCheck },
  { to: "/network", label: "Arquitectura de Red", icon: Network },
  { to: "/services", label: "Servicios AWS", icon: Server },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <button
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 cursor-default bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-2">
            <Cloud size={22} className="text-primary" strokeWidth={2.5} />
            <span className="text-[16px] font-semibold text-white">
              CloudOps Dashboard
            </span>
          </div>
          <button
            aria-label="Cerrar menú"
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-colors ${
                  isActive
                    ? "bg-primary/15 font-medium text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-6 py-4 text-[12px] text-slate-500">
          Cloud Foundations · Semanas 5-6
        </div>
      </aside>
    </>
  );
}