import type { SecurityIndicator } from "../types/cloud";

export interface SecuritySection {
  id: string;
  title: string;
  description: string;
  indicators: SecurityIndicator[];
}

export const securitySections: SecuritySection[] = [
  {
    id: "responsability",
    title: "Modelo de responsabilidad compartida",
    description: "Qué protege AWS y qué protege el cliente en la nube",
    indicators: [
      {
        id: "aws-security",
        title: "Seguridad DE la nube (AWS)",
        description:
          "Hardware, red, centros de datos e hipervisor protegidos por AWS.",
        status: "ok",
      },
      {
        id: "client-security",
        title: "Seguridad EN la nube (Cliente)",
        description:
          "Configuración de servicios, datos, accesos y aplicaciones bajo responsabilidad del cliente.",
        status: "warning",
      },
    ],
  },
  {
    id: "iam",
    title: "IAM",
    description: "Usuarios, roles y políticas de acceso",
    indicators: [
      {
        id: "iam-users",
        title: "Usuarios IAM",
        description: "12 usuarios creados con aplicado el principio de menor privilegio.",
        status: "ok",
      },
      {
        id: "iam-roles",
        title: "Roles de servicio",
        description: "Roles asignados a EC2, Lambda y ECS de forma correcta.",
        status: "ok",
      },
      {
        id: "iam-policies",
        title: "Políticas de acceso",
        description: "2 políticas con permisos demasiado amplios (Action: '*').",
        status: "warning",
      },
    ],
  },
  {
    id: "accounts",
    title: "Protección de cuentas",
    description: "MFA y gestión de cuentas de administración",
    indicators: [
      {
        id: "mfa",
        title: "MFA habilitado",
        description: "Autenticación de doble factor activa en todas las cuentas root.",
        status: "ok",
      },
      {
        id: "root-account",
        title: "Cuenta root",
        description: "Sin uso directo, contraseña rotada y alias configurado.",
        status: "ok",
      },
      {
        id: "access-keys",
        title: "Rotación de access keys",
        description: "3 claves de acceso antiguas (más de 90 días) sin rotar.",
        status: "error",
      },
    ],
  },
  {
    id: "data",
    title: "Protección de datos",
    description: "Cifrado en reposo y en tránsito",
    indicators: [
      {
        id: "encryption-at-rest",
        title: "Cifrado en reposo",
        description: "S3, EBS y RDS cifrados con claves administradas por KMS.",
        status: "ok",
      },
      {
        id: "encryption-in-transit",
        title: "Cifrado en tránsito",
        description: "TLS 1.2+ habilitado en todos los endpoints públicos.",
        status: "ok",
      },
      {
        id: "backups",
        title: "Backups y snapshots",
        description: "El último snapshot de RDS tiene 14 días de antigüedad.",
        status: "warning",
      },
    ],
  },
  {
    id: "compliance",
    title: "Cumplimiento",
    description: "Certificaciones y normativas simuladas",
    indicators: [
      {
        id: "iso27001",
        title: "ISO 27001",
        description: "Certificación vigente, auditoría anual aprobada.",
        status: "ok",
      },
      {
        id: "gdpr",
        title: "GDPR",
        description: "Procesamiento de datos de la UE alineado al reglamento.",
        status: "ok",
      },
      {
        id: "soc2",
        title: "SOC 2",
        description: "El control SSO-16 quedó fuera de cumplimiento en la última revisión.",
        status: "error",
      },
    ],
  },
];