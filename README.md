# CloudOps Dashboard

Panel de administración Cloud para la **planificación, estimación de costos y monitoreo de una solución en AWS**. Permite registrar propuestas de arquitectura, calcular costos simulados por servicio, visualizar el despliegue global en regiones, auditar el estado de seguridad y recorrer el flujo de red propuesto, todo desde una interfaz responsive.

> **Problema que resuelve**: centralizar en una sola pantalla la información clave de un proyecto Cloud (servicios, costos, regiones, seguridad y arquitectura de red) para facilitar la toma de decisiones antes de implementar la infraestructura real.

## Tecnologías

- **React** — interfaz de usuario basada en componentes
- **TypeScript** — tipado estático y contratos de datos (`src/types/cloud.ts`)
- **Tailwind CSS** — diseño y sistema de tokens (paleta en `tailwind.config.js`)
- **React Router** — navegación entre módulos
- **Lucide React** — iconografía
- **Recharts** — gráficos (barras y torta)

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación se abre en la URL que indique Vite (por defecto `http://localhost:5173`).

## Funcionalidades por módulo

### 1. Dashboard
Resumen general de la solución Cloud: indicadores de servicios utilizados, región seleccionada, costos mensual/anual estimados, estado de seguridad, recursos Cloud y estado de la arquitectura. Incluye gráfico de barras con la evolución del costo mensual de los últimos 6 meses y un bloque de resumen de seguridad.

> [CAPTURA AQUÍ]

### 2. Planificación
Formulario para registrar propuestas de solución Cloud (nombre, tipo de aplicación, descripción, región AWS, usuarios estimados, disponibilidad y servicios seleccionados). Valida los campos obligatorios y lista las propuestas en tarjetas.

> [CAPTURA AQUÍ]

### 3. Costos
Estimador de costos por servicio (tarifa horaria × cantidad × horas). Calcula costo estimado, mensual (×30) y anual (×12), agrega cada estimación a una lista y muestra la distribución de costos por servicio en un gráfico de torta.

> [CAPTURA AQUÍ]

### 4. Infraestructura
Mapa esquemático global con 6 regiones AWS reales, posicionadas de forma aproximada, y grid de tarjetas por región con sus servicios desplegados y estado (semáforo).

> [CAPTURA AQUÍ]

### 5. Seguridad
Panel con 5 secciones: modelo de responsabilidad compartida, IAM, protección de cuentas, protección de datos y cumplimiento. Incluye contador de "X de Y controles correctos" con barra de cumplimiento.

> [CAPTURA AQUÍ]

### 6. Arquitectura de Red
Diagrama del flujo Internet → Route 53 → CloudFront → VPC, con subredes pública y privada (EC2 y RDS) dentro de la VPC. Se apila verticalmente en mobile.

> [CAPTURA AQUÍ]

### 7. Servicios AWS
Catálogo de servicios con buscador por nombre y filtros por categoría. Cada tarjeta muestra nombre, categoría, descripción, función principal y estado de utilización.

> [CAPTURA AQUÍ]

## Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables (StatCard, ServiceCard, etc.)
├── data/           # Datos mock (dashboard, regiones, seguridad, servicios)
├── pages/          # Un módulo por ruta / página
└── types/          # Interfaces compartidas (cloud.ts)
```