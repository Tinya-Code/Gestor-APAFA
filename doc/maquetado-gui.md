# Guía de Maquetado — Gestor APAFA

> Generada desde A5 (Backend, Endpoints y Frontend). Documento de referencia para el desarrollo de interfaces.

---

## Convenciones

- **Rutas relativas** al dominio base de la app (ej: `/padres`, `/eventos/1/asistencia`).
- **Actores**: N1=Admin, N2=Presidente, N3=Tesorero, N4=Secretario, N5=Padre, N6=Sistema (sin UI).
- **CRUD por pantalla**: toda pantalla lista implícita acceso a detalle; toda pantalla detalle puede abrir formulario crear/editar si el actor tiene permiso de escritura.
- **Componentes reutilizables**: Tabla, Tarjeta, Formulario, Dashboard. Se definen por módulo pero el patrón se repite.

---

## Listado de Todas las Pantallas

### F1 — Autenticación

| # | Pantalla | Ruta sugerida | Actores | Endpoint |
|---|----------|---------------|---------|----------|
| 1 | Login | `/login` | N1–N5 | `POST /auth/login` |
| 2 | Logout | (acción, no pantalla) | N1–N5 | `POST /auth/logout` |
| 3 | Gestión de roles | `/roles` | N1 | `GET /roles`, `PUT /roles/:id` |

---

### F2 — Padres y Estudiantes

| # | Pantalla | Ruta sugerida | Actores | Endpoint |
|---|----------|---------------|---------|----------|
| 4 | Lista de padres | `/padres` | N1–N4 | `GET /parents` |
| 5 | Detalle de padre | `/padres/:id` | N1–N4 | `GET /parents/:id` |
| 6 | Formulario padre | `/padres/nuevo` · `/padres/:id/editar` | N1, N2 | `POST/PUT /parents` |
| 7 | Lista de estudiantes | `/estudiantes` | N1–N4 | `GET /students` |
| 8 | Detalle de estudiante | `/estudiantes/:id` | N1–N4 | `GET /students/:id` |
| 9 | Formulario estudiante | `/estudiantes/nuevo` · `/estudiantes/:id/editar` | N1, N2 | `POST/PUT /students`, `PATCH /students/:id/parent` |

---

### F3 — Directiva

| # | Pantalla | Ruta sugerida | Actores | Endpoint |
|---|----------|---------------|---------|----------|
| 10 | Lista de directiva | `/directiva` | N1–N4 | `GET /board-members` |
| 11 | Detalle de miembro | `/directiva/:id` | N1–N4 | `GET /board-members/:id` |
| 12 | Formulario miembro | `/directiva/nuevo` · `/directiva/:id/editar` | N1, N2 | `POST/PUT /board-members` |

---

### F4 — Asambleas

| # | Pantalla | Ruta sugerida | Actores | Endpoint |
|---|----------|---------------|---------|----------|
| 13 | Lista de asambleas | `/asambleas` | N1–N4 | `GET /assemblies` |
| 14 | Detalle de asamblea + detalles | `/asambleas/:id` | N1–N4 | `GET /assemblies/:id` |
| 15 | Formulario asamblea | `/asambleas/nueva` · `/asambleas/:id/editar` | N1, N2 | `POST/PUT /assemblies` |
| 16 | Formulario detalle de asamblea | `/asambleas/:id/detalles/nuevo` · `.../:detailId/editar` | N1, N2, N4 | `POST/PUT /assemblies/:id/details` |

---

### F5 — Eventos

| # | Pantalla | Ruta sugerida | Actores | Endpoint |
|---|----------|---------------|---------|----------|
| 17 | Lista de eventos | `/eventos` | N1–N5 | `GET /events` |
| 18 | Detalle de evento | `/eventos/:id` | N1–N5 | `GET /events/:id` |
| 19 | Formulario evento | `/eventos/nuevo` · `/eventos/:id/editar` | N1, N2 | `POST/PUT /events` |

---

### F6 — Asistencias

| # | Pantalla | Ruta sugerida | Actores | Endpoint |
|---|----------|---------------|---------|----------|
| 20 | Lista de asistencias por evento | `/eventos/:id/asistencia` | N1–N4 | `GET /events/:id/attendance` |
| 21 | Formulario registrar/editar asistencia | `/eventos/:id/asistencia/nueva` · `.../:attendanceId/editar` | N1, N2, N4 | `POST/PUT /events/:id/attendance` |

---

### F7 — Multas

| # | Pantalla | Ruta sugerida | Actores | Endpoint |
|---|----------|---------------|---------|----------|
| 22 | Lista de multas | `/multas` | N1–N4 | `GET /fines` |
| 23 | Detalle de multa | `/multas/:id` | N1–N4 | `GET /fines/:id` |
| 24 | Formulario multa manual | `/multas/nueva` · `/multas/:id/editar` | N1, N2, N3 | `POST/PUT /fines` |
| 25 | Estado de multas por padre | `/padres/:id/multas` | N1–N4 | `GET /parents/:id/fines` |
| 26 | Generación automática | (background/cron, sin pantalla) | N6 | `POST /fines/generate` |

---

### F8 — Ingresos

| # | Pantalla | Ruta sugerida | Actores | Endpoint |
|---|----------|---------------|---------|----------|
| 27 | Lista de ingresos | `/ingresos` | N1, N2, N3 | `GET /income` |
| 28 | Detalle de ingreso | `/ingresos/:id` | N1, N2, N3 | `GET /income/:id` |
| 29 | Formulario ingreso | `/ingresos/nuevo` · `/ingresos/:id/editar` | N1, N2, N3 | `POST/PUT /income` |
| 30 | Historial de ingresos por padre | `/padres/:id/ingresos` | N1, N2, N3 | `GET /parents/:id/income` |
| 31 | Panel de totales | `/ingresos/panel` | N1, N2, N3 | `GET /income/totals-panel` |
| 32 | Estado financiero por padre | `/padres/:id/estado-financiero` | N1, N2, N3 | `GET /parents/:id/financial-status` |

---

### F9 — Gastos

| # | Pantalla | Ruta sugerida | Actores | Endpoint |
|---|----------|---------------|---------|----------|
| 33 | Lista de gastos | `/gastos` | N1, N2, N3 | `GET /expenses` |
| 34 | Detalle de gasto | `/gastos/:id` | N1, N2, N3 | `GET /expenses/:id` |
| 35 | Formulario comprobante | `/gastos/comprobantes/nuevo` · `.../:id/editar` | N1, N2, N3 | `POST/PUT /receipts` |
| 36 | Formulario item de gasto | `/gastos/comprobantes/:id/items/nuevo` · `.../:itemId/editar` | N1, N2, N3 | `POST/PUT /receipts/:id/items` |
| 37 | Formulario gasto | `/gastos/nuevo` · `/gastos/:id/editar` | N1, N2, N3 | `POST/PUT /expenses` |

---

### F10 — Movimientos y Reportes Financieros

| # | Pantalla | Ruta sugerida | Actores | Endpoint |
|---|----------|---------------|---------|----------|
| 38 | Lista de movimientos | `/movimientos` | N1, N2, N3 | `GET /transactions` |
| 39 | Detalle de movimiento | `/movimientos/:id` | N1, N2, N3 | `GET /transactions/:id` |
| 40 | Balance general | `/movimientos/balance` | N1, N2, N3 | `GET /transactions/balance` |
| 41 | Generar/exportar reporte | `/reportes` | N1, N2, N3 | `GET /reports/financial`, `/export` |

---

### F11 — Avisos

| # | Pantalla | Ruta sugerida | Actores | Endpoint |
|---|----------|---------------|---------|----------|
| 42 | Lista de avisos | `/avisos` | N1–N5 | `GET /notices` |
| 43 | Detalle de aviso | `/avisos/:id` | N1–N5 | `GET /notices/:id` |

---

## Resumen Cuantitativo

| Categoría | Cantidad |
|-----------|----------|
| **Total de pantallas** | **43** |
| Módulos con pantallas | 11 (F1–F11) |
| Pantallas de listado (tablas) | 14 |
| Pantallas de detalle (tarjetas) | 12 |
| Formularios (crear/editar) | 15 |
| Dashboards / paneles | 2 |
| Acciones sin pantalla (logout, generación automática) | 2 |

---

## Pantallas por Actor — Tabla Rápida

| Actor | Pantallas que ve | Cantidad |
|-------|-----------------|----------|
| **N1 Admin** | Todas (1–43) | 43 |
| **N2 Presidente** | Todas excepto gestión de roles (#3) y eliminar | 41 |
| **N3 Tesorero** | #1, #22–41 (multas, ingresos, gastos, movimientos, reportes) | 22 |
| **N4 Secretario** | #1, #4–16, #20–23, #42–43 (lectura + asistencias + asambleas) | 24 |
| **N5 Padre** | #1, #17–18, #42–43 (eventos y avisos) | 5 |

---

## Checklist de Maquetado

Para cada pantalla, verificar:

- [ ] **Listado**: tabla con columnas visibles, paginación, filtros
- [ ] **Detalle**: tarjeta/card con todos los campos del backend
- [ ] **Formulario**: campos obligatorios marcados, validación, botones guardar/cancelar
- [ ] **Permisos**: botones de acción (editar/eliminar) solo visibles para roles con permiso
- [ ] **Responsive**: diseño mobile-first o adaptativo
- [ ] **Estados vacíos**: mensaje cuando no hay registros
- [ ] **Loading**: skeleton o spinner durante carga
- [ ] **Errores**: mensajes de error comprensibles
- [ ] **Navegación**: breadcrumbs o links de vuelta al listado

---

## Flujo de Navegación General

### Árbol de Rutas Completo

```
/login
  │
  ├──→ / (Home / Dashboard según rol)
  │
  │    ═══════════════════════════════════════════════════
  │    NAVEGACIÓN PRINCIPAL — Sidebar / Menú
  │    ═══════════════════════════════════════════════════
  │
  ├─── F2  PADRES Y ESTUDIANTES ──────────────────────────
  │    │
  │    ├── /padres                          [ Lista de padres ]
  │    │     │
  │    │     ├── /padres/:id                [ Detalle padre ]
  │    │     │     │
  │    │     │     ├── /padres/:id/editar            [ Formulario editar padre ]
  │    │     │     ├── /padres/:id/multas            [ F7 — Multas del padre ]
  │    │     │     │     └── /multas/:id             [ Detalle multa ]
  │    │     │     ├── /padres/:id/ingresos          [ F8 — Historial ingresos padre ]
  │    │     │     │     └── /ingresos/:id           [ Detalle ingreso ]
  │    │     │     └── /padres/:id/estado-financiero [ F8 — Estado financiero ]
  │    │     │
  │    │     └── /padres/nuevo              [ Formulario crear padre ] [ Formulario crear /*asignar estudiante ]
  │    │
       └── /estudiantes/nuevo         [ Formulario crear estudiante ]
       ├── /estudiantes/:id/editar       [ Formulario editar estudiante ]

  │
  │
  ├─── F3  DIRECTIVA ─────────────────────────────────────
  │    │
  │    ├── /directiva                       [ Lista de directiva ]
  │    │     │
  │    │     ├── /directiva/:id             [ Detalle miembro ]
  │    │     │     └── /directiva/:id/editar         [ Formulario editar miembro ]
  │    │     │
  │    │     └── /directiva/nuevo           [ Formulario crear miembro ]
  │    │
  │    └── (el miembro vinculado a un padre puede clickearse → /padres/:id)
  │
  │
  ├─── F4  ASAMBLEAS ─────────────────────────────────────
  │    │
  │    ├── /asambleas                       [ Lista de asambleas ]
  │    │     │
  │    │     ├── /asambleas/:id             [ Detalle asamblea + detalles/anexos ]
  │    │     │     │
  │    │     │     ├── /asambleas/:id/editar         [ Formulario editar asamblea ]
  │    │     │     ├── /asambleas/:id/detalles/nuevo [ Formulario crear detalle ]
  │    │     │     └── /asambleas/:id/detalles/:detailId/editar [ Formulario editar detalle ]
  │    │     │
  │    │     └── /asambleas/nueva           [ Formulario crear asamblea ]
  │    │
  │    └── (N4 solo lectura: ve lista y detalle, puede crear/editar detalles)
  │
  │
  ├─── F5  EVENTOS ───────────────────────────────────────
  │    │
  │    ├── /eventos                         [ Lista de eventos ]
  │    │     │
  │    │     ├── /eventos/:id               [ Detalle evento ]
  │    │     │     │
  │    │     │     ├── /eventos/:id/editar           [ Formulario editar evento ]
  │    │     │     ├── /eventos/:id/asistencia       [ F6 — Lista asistencias ]
  │    │     │     │     │
  │    │     │     │     ├── /eventos/:id/asistencia/nueva              [ Registrar asistencia ]
  │    │     │     │     └── /eventos/:id/asistencia/:attendanceId/editar [ Editar asistencia ]
  │    │     │     │
  │    │     │     └── (si genera_multa → link a multas generadas)
  │    │     │
  │    │     └── /eventos/nuevo             [ Formulario crear evento ]
  │    │
  │    └── (N5 solo lectura: ve lista y detalle, sin asistencia ni forms)
  │
  │
  ├─── F7  MULTAS ────────────────────────────────────────
  │    │
  │    ├── /multas                           [ Lista de multas ]
  │    │     │
  │    │     ├── /multas/:id                [ Detalle multa ]
  │    │     │     └── /multas/:id/editar            [ Formulario editar multa ]
  │    │     │
  │    │     └── /multas/nueva              [ Formulario crear multa manual ]
  │    │
  │    └── /padres/:id/multas               [ Multas por padre — desde F2 ]
  │
  │
  ├─── F8  INGRESOS ──────────────────────────────────────
  │    │
  │    ├── /ingresos                        [ Lista de ingresos ]
  │    │     │
  │    │     ├── /ingresos/:id              [ Detalle ingreso ]
  │    │     │     └── /ingresos/:id/editar          [ Formulario editar ingreso ]
  │    │     │
  │    │     ├── /ingresos/nuevo            [ Formulario crear ingreso ]
  │    │     │
  │    │     └── /ingresos/panel            [ Panel de totales recaudados ]
  │    │
  │    ├── /padres/:id/ingresos             [ Historial ingresos por padre — desde F2 ]
  │    │
  │    └── /padres/:id/estado-financiero    [ Estado financiero combinado — desde F2 ]
  │
  │
  ├─── F9  GASTOS ────────────────────────────────────────
  │    │
  │    ├── /gastos                           [ Lista de gastos ]
  │    │     │
  │    │     ├── /gastos/:id                [ Detalle gasto ]
  │    │     │     │
  │    │     │     ├── /gastos/:id/editar            [ Formulario editar gasto ]
  │    │     │     └── (comprobante e items se ven inline en el detalle)
  │    │     │
  │    │     └── /gastos/nuevo              [ Formulario crear gasto ]
  │    │
  │    └── /gastos/comprobantes/             [ Flujo de comprobantes ]
  │          │
  │          ├── /gastos/comprobantes/nuevo                  [ Crear comprobante ]
  │          ├── /gastos/comprobantes/:id/editar             [ Editar comprobante ]
  │          ├── /gastos/comprobantes/:id/items/nuevo        [ Agregar item al comprobante ]
  │          └── /gastos/comprobantes/:id/items/:itemId/editar [ Editar item ]
  │
  │
  ├─── F10 MOVIMIENTOS Y REPORTES ───────────────────────
  │    │
  │    ├── /movimientos                     [ Lista de movimientos ]
  │    │     │
  │    │     └── /movimientos/:id           [ Detalle movimiento ]
  │    │
  │    ├── /movimientos/balance             [ Dashboard balance general ]
  │    │
  │    └── /reportes                        [ Generar y exportar reportes ]
  │          ├── (filtros: rango fechas, tipo)
  │          ├── [Exportar PDF]
  │          └── [Exportar CSV]
  │
  │
  ├─── F11  AVISOS ───────────────────────────────────────
  │    │
  │    ├── /avisos                           [ Lista de avisos ]
  │    │     │
  │    │     └── /avisos/:id                [ Detalle aviso ]
  │    │
  │    └── (N1–N5: solo lectura, sin CRUD)
  │
  │
  └─── F1  ROLES (solo N1) ──────────────────────────────
       │
       └── /roles                            [ Gestionar roles de usuarios ]
             └── /roles/:id/editar          [ Editar rol de un usuario ]
```

### Navegación Cruzada entre Módulos

Estas son las conexiones que **no están en el sidebar** sino que se acceden desde dentro de una pantalla:

| Desde pantalla | Link a | Módulo | Cómo se llega |
|----------------|--------|--------|---------------|
| Detalle padre (`/padres/:id`) | `/padres/:id/multas` | F7 | Botón "Ver multas" o tab dentro del detalle |
| Detalle padre (`/padres/:id`) | `/padres/:id/ingresos` | F8 | Botón "Ver ingresos" o tab dentro del detalle |
| Detalle padre (`/padres/:id`) | `/padres/:id/estado-financiero` | F8 | Botón "Estado financiero" o tab |
| Detalle padre (`/padres/:id`) | `/estudiantes/:id` | F2 | Lista de estudiantes vinculados (clickeables) |
| Detalle estudiante (`/estudiantes/:id`) | `/padres/:id` | F2 | Link del padre asignado |
| Detalle miembro directiva (`/directiva/:id`) | `/padres/:id` | F2 | Link del padre vinculado al miembro |
| Detalle asamblea (`/asambleas/:id`) | (detalles inline) | F4 | Lista anidada de acuerdos/detalles dentro del detalle |
| Detalle evento (`/eventos/:id`) | `/eventos/:id/asistencia` | F6 | Botón "Ver asistencias" (N1–N4) |
| Detalle gasto (`/gastos/:id`) | (comprobante inline) | F9 | Comprobante e items anidados dentro del detalle |
| Detalle multa (`/multas/:id`) | `/padres/:id` | F2 | Link del padre asociado |
| Detalle multa (`/multas/:id`) | `/eventos/:id` | F5 | Link del evento que generó la multa |
| Detalle ingreso (`/ingresos/:id`) | `/padres/:id` | F2 | Link del padre asociado |
| Detalle ingreso (`/ingresos/:id`) | `/eventos/:id` | F5 | Link del evento asociado (si aplica) |
| Panel totales (`/ingresos/panel`) | `/ingresos` | F8 | Drill-down al listado de ingresos |
| Balance (`/movimientos/balance`) | `/movimientos` | F10 | Drill-down al listado de movimientos |

### Modales / Overlays

Estas acciones se abren como modal o dialog, no como ruta nueva:

| Contexto | Acción | Tipo |
|----------|--------|------|
| Tabla de padres / estudiantes | Confirmar eliminar | Modal confirmación |
| Tabla de directiva | Confirmar eliminar | Modal confirmación |
| Tabla de asambleas | Confirmar eliminar | Modal confirmación |
| Tabla de eventos | Confirmar eliminar | Modal confirmación |
| Tabla de multas | Confirmar eliminar | Modal confirmación |
| Tabla de ingresos | Confirmar eliminar | Modal confirmación |
| Tabla de gastos | Confirmar eliminar | Modal confirmación |
| Formulario estudiante | Selector reasignar padre | Modal / popover con búsqueda |
| Formulario miembro directiva | Vincular a padre existente | Modal / popover con búsqueda |
| Gastos (comprobante) | Agregar item | Inline form dentro del detalle |
| Asamblea (detalle) | Agregar acuerdo | Inline form dentro del detalle |
| Login | Error de credenciales | Toast / alert inline |

### Estados de Pantalla por Rol

| Rol | Home ve | Puede crear | Puede editar | Puede eliminar |
|-----|---------|-------------|--------------|----------------|
| N1 Admin | Resumen general + todos los módulos | Todo | Todo | Todo |
| N2 Presidente | Resumen general + todos excepto roles | Padres, estudiantes, directiva, asambleas, eventos, multas manuales, ingresos, gastos | Padres, estudiantes, directiva, asambleas, eventos, multas, ingresos, gastos | ❌ |
| N3 Tesorero | Panel financiero (ingresos, gastos, multas, balance) | Multas manuales, ingresos, gastos | Multas, ingresos, gastos | ❌ |
| N4 Secretario | Asambleas + asistencias + padres/estudiantes (lectura) | Detalles de asamblea, asistencias | Detalles de asamblea, asistencias | ❌ |
| N5 Padre | Eventos próximos + avisos | ❌ | ❌ | ❌ |
