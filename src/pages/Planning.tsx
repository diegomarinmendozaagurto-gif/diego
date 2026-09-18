import { useState, type FormEvent } from "react";
import {
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
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-text-secondary";

const labelClass = "mb-1 block text-[13px] font-medium text-text-secondary";

export default function Planning() {
  const [form, setForm] = useState<PlanningFormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [proposals, setProposals] = useState<CloudProposal[]>([]);

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
    if (!form.solutionName.trim()) next.solutionName = "Ingresá el nombre de la solución.";
    if (!form.appType) next.appType = "Seleccioná el tipo de aplicación.";
    if (!form.description.trim()) next.description = "Ingresá una descripción de la solución.";
    if (!form.region) next.region = "Seleccioná una región AWS.";
    if (!form.estimatedUsers || Number(form.estimatedUsers) <= 0)
      next.estimatedUsers = "Ingresá un número de usuarios mayor a 0.";
    if (!form.availabilityLevel)
      next.availabilityLevel = "Seleccioná el nivel de disponibilidad.";
    if (form.selectedServices.length === 0)
      next.selectedServices = "Seleccioná al menos un servicio Cloud.";
    if (!form.migrationGoal) next.migrationGoal = "Seleccioná el objetivo de migración.";
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
  };

  return (
    <div className="space-y-6">
      <div className="app-card">
        <h2>Registrar propuesta de solución Cloud</h2>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <ClipboardList size={18} className="text-primary" />
              <p className="font-semibold text-text-primary">Datos de la solución</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="solutionName">
                  Nombre de la solución *
                </label>
                <input
                  id="solutionName"
                  type="text"
                  className={`${inputClass} ${errors.solutionName ? "border-alert" : ""}`}
                  placeholder="Ej. Portal de clientes"
                  value={form.solutionName}
                  onChange={(e) => setField("solutionName", e.target.value)}
                />
                {errors.solutionName && (
                  <p className="mt-1 text-[12px] text-alert">{errors.solutionName}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="appType">
                  Tipo de aplicación *
                </label>
                <select
                  id="appType"
                  className={`${inputClass} ${errors.appType ? "border-alert" : ""}`}
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
                {errors.appType && (
                  <p className="mt-1 text-[12px] text-alert">{errors.appType}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="description">
                  Descripción *
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className={`${inputClass} resize-none ${errors.description ? "border-alert" : ""}`}
                  placeholder="Describí brevemente qué resuelve la solución y su alcance"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
                {errors.description && (
                  <p className="mt-1 text-[12px] text-alert">{errors.description}</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Globe2 size={18} className="text-primary" />
              <p className="font-semibold text-text-primary">
                Región e infraestructura
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="region">
                  Región seleccionada *
                </label>
                <select
                  id="region"
                  className={`${inputClass} ${errors.region ? "border-alert" : ""}`}
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
                {errors.region && (
                  <p className="mt-1 text-[12px] text-alert">{errors.region}</p>
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
                    className={`${inputClass} pl-9 ${errors.estimatedUsers ? "border-alert" : ""}`}
                    placeholder="Ej. 5000"
                    value={form.estimatedUsers}
                    onChange={(e) => setField("estimatedUsers", e.target.value)}
                  />
                </div>
                {errors.estimatedUsers && (
                  <p className="mt-1 text-[12px] text-alert">{errors.estimatedUsers}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="availabilityLevel">
                  Nivel de disponibilidad *
                </label>
                <select
                  id="availabilityLevel"
                  className={`${inputClass} ${errors.availabilityLevel ? "border-alert" : ""}`}
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
                {errors.availabilityLevel && (
                  <p className="mt-1 text-[12px] text-alert">{errors.availabilityLevel}</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Server size={18} className="text-primary" />
              <p className="font-semibold text-text-primary">Servicios Cloud</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {SERVICES.map((service) => {
                const checked = form.selectedServices.includes(service);
                return (
                  <label
                    key={service}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors ${
                      checked
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-text-secondary hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={checked}
                      onChange={() => toggleService(service)}
                    />
                    <span className="text-[13px] font-medium">{service}</span>
                  </label>
                );
              })}
            </div>
            {errors.selectedServices && (
              <p className="mt-1 text-[12px] text-alert">{errors.selectedServices}</p>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Target size={18} className="text-primary" />
              <p className="font-semibold text-text-primary">Objetivo de migración</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="migrationGoal">
                  Objetivo *
                </label>
                <select
                  id="migrationGoal"
                  className={`${inputClass} ${errors.migrationGoal ? "border-alert" : ""}`}
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
                {errors.migrationGoal && (
                  <p className="mt-1 text-[12px] text-alert">{errors.migrationGoal}</p>
                )}
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <ShieldCheck size={18} />
            Registrar propuesta
          </button>
        </form>
      </div>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <PlusCircle size={20} className="text-primary" />
          <h2>Propuestas registradas ({proposals.length})</h2>
        </div>

        {proposals.length === 0 ? (
          <div className="app-card">
            <p className="text-text-secondary">
              Todavía no hay propuestas. Completá el formulario para registrar la
              primera.
            </p>
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
                      <span className="text-[12px] text-text-secondary">
                        {proposal.appType}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${availabilityBadge[proposal.availabilityLevel]}`}
                  >
                    {proposal.availabilityLevel}
                  </span>
                </div>

                <p className="text-text-secondary">{proposal.description}</p>

                <dl className="grid grid-cols-2 gap-3 rounded-lg border border-border p-3 text-[13px] sm:grid-cols-3">
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

                <p className="border-t border-border pt-3 text-[13px] text-text-secondary">
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