import { useEffect, useState, type FormEvent } from "react";
import {
  Check,
  ChevronDown,
  ClipboardList,
  User,
  Globe2,
  Server,
  ShieldCheck,
  Target,
  PlusCircle,
} from "lucide-react";
import type { CloudProposal } from "../types/cloud";

const APP_TYPES = ["Web", "Móvil", "API", "Data/Analytics"] as const;

const REGIONS = [
  { id: "us-east-1", label: "us-east-1 · Virginia, EE.UU." },
  { id: "us-west-2", label: "us-west-2 · Oregón, EE.UU." },
  { id: "eu-west-1", label: "eu-west-1 · Irlanda" },
  { id: "sa-east-1", label: "sa-east-1 · São Paulo, Brasil" },
];

const AVAILABILITY_LEVELS: Array<CloudProposal["availabilityLevel"]> = [
  "Básica",
  "Alta",
  "Crítica",
];

const SERVICES = ["EC2", "S3", "RDS", "Lambda", "CloudFront"];

const MIGRATION_GOALS = [
  "Lift and shift (rehospedaje)",
  "Replataforma",
  "Refactorización / modernización",
  "Caída y reconstrucción",
];

const availabilityBadge: Record<CloudProposal["availabilityLevel"], string> = {
  Básica: "bg-cost/10 text-cost",
  Alta: "bg-security/10 text-security",
  Crítica: "bg-alert/10 text-alert",
};

interface PlanningFormState {
  solutionName: string;
  appType: string;
  description: string;
  region: string;
  estimatedUsers: string;
  availabilityLevel: CloudProposal["availabilityLevel"] | "";
  selectedServices: string[];
  migrationGoal: string;
}

type FieldName = keyof PlanningFormState;

const initialForm: PlanningFormState = {
  solutionName: "",
  appType: "",
  description: "",
  region: "",
  estimatedUsers: "",
  availabilityLevel: "",
  selectedServices: [],
  migrationGoal: "",
};

const inputClass =
  "w-full rounded-xl border border-border/80 bg-background px-3 py-2.5 text-[14px] text-text-primary outline-none transition-all duration-200 placeholder:text-text-secondary/80 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:border-primary dark:focus:ring-primary/20";

const selectClass = `${inputClass} appearance-none pr-10`;
const labelClass = "mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-text-secondary";

const fieldErrorClass = (hasError: boolean, withIcon = false) =>
  `${withIcon ? "pl-9" : ""} ${hasError ? "border-alert bg-alert/5 ring-2 ring-alert/10 focus:border-alert focus:ring-alert/20" : "border-border/80 bg-background hover:border-primary/30"}`;

const serviceChipClass = (checked: boolean, hasError: boolean) =>
  `group flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 ${
    checked
      ? "border-primary bg-primary text-white shadow-[0_0_0_1px_rgba(34,211,238,0.2),0_12px_28px_rgba(34,211,238,0.18)]"
      : "border-border/80 bg-background text-text-secondary hover:border-primary/40 hover:text-primary"
  } ${hasError ? "border-alert" : ""}`;

export default function Planning() {
  const [form, setForm] = useState<PlanningFormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [proposals, setProposals] = useState<CloudProposal[]>([]);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!toastVisible) return;

    const timer = window.setTimeout(() => setToastVisible(false), 2400);
    return () => window.clearTimeout(timer);
  }, [toastVisible]);

  const setField = (key: FieldName, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleService = (service: string) => {
    const selected = form.selectedServices.includes(service)
      ? form.selectedServices.filter((s) => s !== service)
      : [...form.selectedServices, service];
    setField("selectedServices", selected);
  };

  const validate = (): Partial<Record<FieldName, string>> => {
    const next: Partial<Record<FieldName, string>> = {};
    if (!form.solutionName.trim()) next.solutionName = "Este campo es obligatorio";
    if (!form.appType) next.appType = "Este campo es obligatorio";
    if (!form.description.trim()) next.description = "Este campo es obligatorio";
    if (!form.region) next.region = "Este campo es obligatorio";
    if (!form.estimatedUsers || Number(form.estimatedUsers) <= 0)
      next.estimatedUsers = "Este campo es obligatorio";
    if (!form.availabilityLevel) next.availabilityLevel = "Este campo es obligatorio";
    if (form.selectedServices.length === 0)
      next.selectedServices = "Este campo es obligatorio";
    if (!form.migrationGoal) next.migrationGoal = "Este campo es obligatorio";
    return next;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const proposal: CloudProposal = {
      id: crypto.randomUUID(),
      solutionName: form.solutionName.trim(),
      appType: form.appType,
      description: form.description.trim(),
      region: form.region,
      estimatedUsers: Number(form.estimatedUsers),
      availabilityLevel: form.availabilityLevel as CloudProposal["availabilityLevel"],
      selectedServices: [...form.selectedServices].sort(),
      migrationGoal: form.migrationGoal,
      createdAt: new Date().toLocaleDateString("es-AR"),
    };

    setProposals((prev) => [proposal, ...prev]);
    setForm(initialForm);
    setErrors({});
    setToastVisible(true);
  };

  return (
    <div className="space-y-6">
      {toastVisible && (
        <div
          className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-xl border border-security/30 bg-card px-4 py-3 shadow-[0_12px_30px_rgba(34,211,238,0.12)]"
          role="status"
          aria-live="polite"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-security/10 text-security">
            <Check size={16} />
          </div>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
              Confirmación
            </p>
            <p className="text-[14px] font-medium text-text-primary">Propuesta registrada correctamente</p>
          </div>
        </div>
      )}

      <div className="app-card">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              CloudOps
            </p>
            <h2 className="!text-[22px]">Registrar propuesta de solución Cloud</h2>
          </div>
          <div className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">
            Nuevo registro
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <section className="border-t border-border pt-6 first:border-t-0 first:pt-0">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ClipboardList size={16} />
              </div>
              <p className="text-[14px] font-semibold text-text-primary">Datos de la solución</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="solutionName">
                  Nombre de la solución *
                </label>
                <input
                  id="solutionName"
                  type="text"
                  aria-invalid={Boolean(errors.solutionName)}
                  className={`${inputClass} ${fieldErrorClass(Boolean(errors.solutionName))}`}
                  placeholder="Ej. Portal de clientes"
                  value={form.solutionName}
                  onChange={(e) => setField("solutionName", e.target.value)}
                />
                {errors.solutionName && (
                  <p className="mt-1 text-[12px] font-medium text-alert">{errors.solutionName}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="appType">
                  Tipo de aplicación *
                </label>
                <div className="relative">
                  <select
                    id="appType"
                    aria-invalid={Boolean(errors.appType)}
                    className={`${selectClass} ${fieldErrorClass(Boolean(errors.appType))}`}
                    value={form.appType}
                    onChange={(e) => setField("appType", e.target.value)}
                  >
                    <option value="">Seleccioná...</option>
                    {APP_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                </div>
                {errors.appType && (
                  <p className="mt-1 text-[12px] font-medium text-alert">{errors.appType}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="description">
                  Descripción *
                </label>
                <textarea
                  id="description"
                  rows={3}
                  aria-invalid={Boolean(errors.description)}
                  className={`${inputClass} resize-none ${fieldErrorClass(Boolean(errors.description))}`}
                  placeholder="Describí brevemente qué resuelve la solución y su alcance"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
                {errors.description && (
                  <p className="mt-1 text-[12px] font-medium text-alert">{errors.description}</p>
                )}
              </div>
            </div>
          </section>

          <section className="border-t border-border pt-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Globe2 size={16} />
              </div>
              <p className="text-[14px] font-semibold text-text-primary">Región e infraestructura</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="region">
                  Región seleccionada *
                </label>
                <div className="relative">
                  <select
                    id="region"
                    aria-invalid={Boolean(errors.region)}
                    className={`${selectClass} ${fieldErrorClass(Boolean(errors.region))}`}
                    value={form.region}
                    onChange={(e) => setField("region", e.target.value)}
                  >
                    <option value="">Seleccioná...</option>
                    {REGIONS.map(({ id, label }) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                </div>
                {errors.region && (
                  <p className="mt-1 text-[12px] font-medium text-alert">{errors.region}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="estimatedUsers">
                  Usuarios estimados *
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  />
                  <input
                    id="estimatedUsers"
                    type="number"
                    min={1}
                    aria-invalid={Boolean(errors.estimatedUsers)}
                    className={`${inputClass} ${fieldErrorClass(Boolean(errors.estimatedUsers), true)}`}
                    placeholder="Ej. 5000"
                    value={form.estimatedUsers}
                    onChange={(e) => setField("estimatedUsers", e.target.value)}
                  />
                </div>
                {errors.estimatedUsers && (
                  <p className="mt-1 text-[12px] font-medium text-alert">{errors.estimatedUsers}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="availabilityLevel">
                  Nivel de disponibilidad *
                </label>
                <div className="relative">
                  <select
                    id="availabilityLevel"
                    aria-invalid={Boolean(errors.availabilityLevel)}
                    className={`${selectClass} ${fieldErrorClass(Boolean(errors.availabilityLevel))}`}
                    value={form.availabilityLevel}
                    onChange={(e) => setField("availabilityLevel", e.target.value)}
                  >
                    <option value="">Seleccioná...</option>
                    {AVAILABILITY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                </div>
                {errors.availabilityLevel && (
                  <p className="mt-1 text-[12px] font-medium text-alert">{errors.availabilityLevel}</p>
                )}
              </div>
            </div>
          </section>

          <section className="border-t border-border pt-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Server size={16} />
              </div>
              <p className="text-[14px] font-semibold text-text-primary">Servicios Cloud</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {SERVICES.map((service) => {
                const checked = form.selectedServices.includes(service);

                return (
                  <button
                    type="button"
                    key={service}
                    aria-pressed={checked}
                    onClick={() => toggleService(service)}
                    className={serviceChipClass(checked, Boolean(errors.selectedServices))}
                  >
                    <span className="text-[13px] font-semibold">{service}</span>
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-sm border transition-all duration-200 ${
                        checked
                          ? "border-white bg-white text-primary"
                          : "border-current bg-transparent"
                      }`}
                    >
                      {checked && <Check size={10} className="stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.selectedServices && (
              <p className="mt-1 text-[12px] font-medium text-alert">{errors.selectedServices}</p>
            )}
          </section>

          <section className="border-t border-border pt-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target size={16} />
              </div>
              <p className="text-[14px] font-semibold text-text-primary">Objetivo de migración</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="migrationGoal">
                  Objetivo *
                </label>
                <div className="relative">
                  <select
                    id="migrationGoal"
                    aria-invalid={Boolean(errors.migrationGoal)}
                    className={`${selectClass} ${fieldErrorClass(Boolean(errors.migrationGoal))}`}
                    value={form.migrationGoal}
                    onChange={(e) => setField("migrationGoal", e.target.value)}
                  >
                    <option value="">Seleccioná...</option>
                    {MIGRATION_GOALS.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                </div>
                {errors.migrationGoal && (
                  <p className="mt-1 text-[12px] font-medium text-alert">{errors.migrationGoal}</p>
                )}
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
            <p className="text-[12px] text-text-secondary">* campos obligatorios</p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_12px_24px_rgba(37,99,235,0.2)] dark:text-background"
            >
              <ShieldCheck size={18} />
              Registrar propuesta
            </button>
          </div>
        </form>
      </div>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <PlusCircle size={16} />
          </div>
          <h2>Propuestas registradas ({proposals.length})</h2>
        </div>

        {proposals.length === 0 ? (
          <div className="app-card">
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 text-primary">
                <ClipboardList size={28} />
              </div>
              <p className="text-[15px] font-semibold text-text-primary">Todavía no hay propuestas...</p>
              <p className="max-w-md text-text-secondary">
                Completá el formulario para registrar la primera.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {proposals.map((proposal) => (
              <article key={proposal.id} className="app-card flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ClipboardList size={18} />
                    </div>
                    <div>
                      <p className="text-[16px] font-semibold text-text-primary">
                        {proposal.solutionName}
                      </p>
                      <span className="text-[12px] text-text-secondary">{proposal.appType}</span>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${availabilityBadge[proposal.availabilityLevel]}`}
                  >
                    {proposal.availabilityLevel}
                  </span>
                </div>

                <p className="text-text-secondary">{proposal.description}</p>

                <dl className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-background/60 p-3 text-[13px] sm:grid-cols-3">
                  <div>
                    <dt className="text-[12px] text-text-secondary">Región</dt>
                    <dd className="font-medium text-text-primary">{proposal.region}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-text-secondary">Usuarios</dt>
                    <dd className="font-medium text-text-primary">
                      {proposal.estimatedUsers.toLocaleString("en-US")}
                    </dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-[12px] text-text-secondary">Registrada</dt>
                    <dd className="font-medium text-text-primary">{proposal.createdAt}</dd>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-2">
                  {proposal.selectedServices.map((service) => (
                    <span
                      key={service}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[12px] font-medium text-primary"
                    >
                      <Server size={12} />
                      {service}
                    </span>
                  ))}
                </div>

                <p className="circuit-divider pt-3 text-[13px] text-text-secondary">
                  <span className="font-medium text-text-primary">Objetivo:</span>{" "}
                  {proposal.migrationGoal}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
