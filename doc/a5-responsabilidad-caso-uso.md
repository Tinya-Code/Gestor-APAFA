
# Separación por Módulos — Backend, Endpoints y Frontend

Basado en la matriz de accesos (casos de uso x actores) y el modelo de entidades.

**Actores:** N1 Administrador · N2 Presidente/Vicepresidente · N3 Tesorero · N4 Secretario/Vocal · N5 Padre · N6 Sistema

**Convención de endpoints:** prefijo base `/api/v1`. Autenticación vía token (JWT/session); cada endpoint indica qué roles pueden invocarlo. `[N1-N4]` significa N1, N2, N3 y N4.

---

## 1. Módulos de Backend y Endpoints REST

### M1. Autenticación y Roles
**Entidades:** usuario (ligado a Padre/Directiva), Roles

| Método | Endpoint | Descripción | Actores |
|---|---|---|---|
| POST | `/auth/login` | Inicia sesión, retorna token | N1-N5 |
| POST | `/auth/logout` | Cierra sesión / invalida token | N1-N5 |
| GET | `/auth/me` | Retorna perfil y rol del usuario autenticado | N1-N5 |
| GET | `/roles` | Lista roles disponibles | N1 |
| PUT | `/roles/:id` | Asigna/edita rol de un usuario | N1 |

### M2. Padres y Estudiantes
**Entidades:** `Padre`, `Estudiante`

| Método | Endpoint | Descripción | Actores |
|---|---|---|---|
| GET | `/padres` | Lista padres (paginado, filtros) | N1-N4 |
| GET | `/padres/:id` | Detalle de un padre | N1-N4 |
| POST | `/padres` | Registra un padre | N1, N2 |
| PUT | `/padres/:id` | Edita un padre | N1, N2 |
| DELETE | `/padres/:id` | Elimina un padre | N1 |
| GET | `/estudiantes` | Lista estudiantes (filtro por grado/sección/padre) | N1-N4 |
| GET | `/estudiantes/:id` | Detalle de un estudiante | N1-N4 |
| POST | `/estudiantes` | Registra un estudiante | N1, N2 |
| PUT | `/estudiantes/:id` | Edita un estudiante | N1, N2 |
| DELETE | `/estudiantes/:id` | Elimina un estudiante | N1 |
| PATCH | `/estudiantes/:id/padre` | Asocia/reasigna estudiante a un padre (`id_padre`) | N1, N2 |

### M3. Directiva
**Entidades:** `Directiva`

| Método | Endpoint | Descripción | Actores |
|---|---|---|---|
| GET | `/directiva` | Lista miembros de la directiva | N1-N4 |
| GET | `/directiva/:id` | Detalle de un miembro | N1-N4 |
| POST | `/directiva` | Registra un miembro (rol, fecha_inicio) | N1, N2 |
| PUT | `/directiva/:id` | Edita un miembro (rol, fecha_fin, etc.) | N1, N2 |
| DELETE | `/directiva/:id` | Elimina un miembro | N1 |

### M4. Asambleas
**Entidades:** `Asamblea`, `DetalleAsamblea`

| Método | Endpoint | Descripción | Actores |
|---|---|---|---|
| GET | `/asambleas` | Lista asambleas | N1-N4 |
| GET | `/asambleas/:id` | Detalle de asamblea (incluye sus detalles) | N1-N4 |
| POST | `/asambleas` | Registra asamblea | N1, N2 |
| PUT | `/asambleas/:id` | Edita asamblea | N1, N2 |
| DELETE | `/asambleas/:id` | Elimina asamblea | N1 |
| POST | `/asambleas/:id/detalles` | Registra un detalle/acuerdo de asamblea | N1, N2, N4 |
| PUT | `/asambleas/:id/detalles/:detalleId` | Edita un detalle de asamblea | N1, N2, N4 |
| DELETE | `/asambleas/:id/detalles/:detalleId` | Elimina un detalle de asamblea | N1, N2 |

### M5. Eventos
**Entidades:** `Evento`

| Método | Endpoint | Descripción | Actores |
|---|---|---|---|
| GET | `/eventos` | Lista eventos | N1-N5 |
| GET | `/eventos/:id` | Detalle de evento (flags genera_multa, genera_asistencia, etc.) | N1-N5 |
| POST | `/eventos` | Registra evento | N1, N2 |
| PUT | `/eventos/:id` | Edita evento | N1, N2 |
| DELETE | `/eventos/:id` | Elimina evento | N1 |

### M6. Asistencias
**Entidades:** `Asistencia`

| Método | Endpoint | Descripción | Actores |
|---|---|---|---|
| GET | `/eventos/:id/asistencias` | Lista asistencias de un evento | N1-N4 |
| POST | `/eventos/:id/asistencias` | Registra asistencia de un padre a un evento | N1, N2, N4 |
| PUT | `/eventos/:id/asistencias/:asistId` | Edita un registro de asistencia | N1, N2, N4 |

### M7. Multas
**Entidades:** `Multa`

| Método | Endpoint | Descripción | Actores |
|---|---|---|---|
| GET | `/multas` | Lista multas (filtros por padre/evento/estado) | N1-N4 |
| GET | `/multas/:id` | Detalle de multa | N1-N4 |
| POST | `/multas` | Registra multa manual | N1, N2, N3 |
| POST | `/multas/generar` | Genera multas automáticas por inasistencia (batch) | N1, N6 |
| PUT | `/multas/:id` | Edita multa (monto, estado de pago) | N1, N2, N3 |
| DELETE | `/multas/:id` | Elimina multa | N1 |
| GET | `/padres/:id/multas` | Estado de multas de un padre específico | N1-N4 |

### M8. Finanzas — Ingresos
**Entidades:** `Ingreso`

| Método | Endpoint | Descripción | Actores |
|---|---|---|---|
| GET | `/ingresos` | Lista ingresos (filtros por tipo/fecha/padre) | N1, N2, N3 |
| GET | `/ingresos/:id` | Detalle de ingreso | N1, N2, N3 |
| POST | `/ingresos` | Registra ingreso (donación, multa, aporte, cuota) | N1, N2, N3 |
| PUT | `/ingresos/:id` | Edita ingreso | N1, N2, N3 |
| DELETE | `/ingresos/:id` | Elimina ingreso | N1 |
| GET | `/padres/:id/ingresos` | Historial de ingresos de un padre | N1, N2, N3 |
| GET | `/ingresos/panel-totales` | Panel de totales recaudados y pendientes | N1, N2, N3 |
| GET | `/padres/:id/estado-financiero` | Estado combinado de ingresos y multas por padre | N1, N2, N3 |

### M9. Finanzas — Gastos
**Entidades:** `Comprobante`, `ItemGasto`, `Gasto`

| Método | Endpoint | Descripción | Actores |
|---|---|---|---|
| GET | `/gastos` | Lista gastos (filtros por tipo/fecha) | N1, N2, N3 |
| GET | `/gastos/:id` | Detalle de gasto (incluye comprobante e items) | N1, N2, N3 |
| POST | `/gastos` | Registra gasto | N1, N2, N3 |
| PUT | `/gastos/:id` | Edita gasto (incluye reclasificar tipo/fecha) | N1, N2, N3 |
| DELETE | `/gastos/:id` | Elimina gasto | N1 |
| POST | `/comprobantes` | Registra comprobante | N1, N2, N3 |
| PUT | `/comprobantes/:id` | Edita comprobante | N1, N2, N3 |
| DELETE | `/comprobantes/:id` | Elimina comprobante | N1 |
| POST | `/comprobantes/:id/items` | Registra item de gasto sobre un comprobante | N1, N2, N3 |
| PUT | `/comprobantes/:id/items/:itemId` | Edita item de gasto | N1, N2, N3 |
| DELETE | `/comprobantes/:id/items/:itemId` | Elimina item de gasto | N1 |

### M10. Finanzas — Movimientos y Reportes
**Entidades:** `Movimiento`

| Método | Endpoint | Descripción | Actores |
|---|---|---|---|
| GET | `/movimientos` | Lista movimientos (ingreso/egreso) | N1, N2, N3 |
| GET | `/movimientos/:id` | Detalle de movimiento | N1, N2, N3 |
| GET | `/movimientos/balance` | Balance general (totales ingreso vs egreso) | N1, N2, N3 |
| GET | `/reportes/financiero` | Genera reporte financiero (parámetros: rango de fechas, tipo) | N1, N2, N3 |
| GET | `/reportes/financiero/export?formato=pdf` | Exporta reporte a PDF | N1, N2, N3 |
| GET | `/reportes/financiero/export?formato=csv` | Exporta reporte a CSV | N1, N2, N3 |

### M11. Avisos
**Entidades:** `Aviso`

| Método | Endpoint | Descripción | Actores |
|---|---|---|---|
| GET | `/avisos` | Lista avisos (generados desde eventos/multas) | N1-N5 |
| GET | `/avisos/:id` | Detalle de un aviso | N1-N5 |

> Los avisos no tienen endpoints de escritura expuestos al usuario: se crean internamente cuando M5 (Eventos) o M7 (Multas) disparan una notificación (`tipo` + `id_referencia`).

---

## 2. Reglas transversales de la API

- **Autorización:** cada endpoint valida el rol del token contra la tabla de actores; un 403 se retorna si el rol no coincide (ej. N5 intentando `POST /padres`).
- **Paginación:** todos los `GET` de listados aceptan `?page` y `?limit`.
- **Filtros comunes:** `?fecha_desde`, `?fecha_hasta` en endpoints financieros y de eventos/asambleas.
- **Errores:** formato estándar `{ "error": { "code": "...", "message": "..." } }`.
- **Auditoría:** operaciones de escritura en M7-M10 (multas, ingresos, gastos, movimientos) deberían registrar `id_directiva` o usuario que ejecuta la acción.
- **Endpoint de sistema (N6):** `POST /multas/generar` debe poder ser invocado por un job/cron interno con credenciales de servicio, no solo por N1.

---

## 3. Módulos de Frontend — Pantallas

### F1. Autenticación
- Pantalla: Login *(N1-N5)* → consume `POST /auth/login`
- Acción: Logout *(N1-N5)* → consume `POST /auth/logout`
- Pantalla: Gestión de roles *(N1)* → consume `GET /roles`, `PUT /roles/:id`

### F2. Padres y Estudiantes
- Pantalla: Lista de padres *(N1-N4)* → `GET /padres`
- Pantalla: Detalle de padre *(N1-N4)* → `GET /padres/:id`
- Pantalla: Formulario padre (crear/editar) *(N1, N2)* → `POST/PUT /padres`
- Pantalla: Lista de estudiantes *(N1-N4)* → `GET /estudiantes`
- Pantalla: Detalle de estudiante *(N1-N4)* → `GET /estudiantes/:id`
- Pantalla: Formulario estudiante (crear/editar, asociar a padre) *(N1, N2)* → `POST/PUT /estudiantes`, `PATCH /estudiantes/:id/padre`

### F3. Directiva
- Pantalla: Lista de directiva *(N1-N4)* → `GET /directiva`
- Pantalla: Detalle de miembro *(N1-N4)* → `GET /directiva/:id`
- Pantalla: Formulario miembro (crear/editar) *(N1, N2)* → `POST/PUT /directiva`

### F4. Asambleas
- Pantalla: Lista de asambleas *(N1-N4)* → `GET /asambleas`
- Pantalla: Detalle de asamblea + lista de detalles *(N1-N4)* → `GET /asambleas/:id`
- Pantalla: Formulario asamblea (crear/editar) *(N1, N2)* → `POST/PUT /asambleas`
- Pantalla: Formulario detalle de asamblea (crear/editar) *(N1, N2, N4)* → `POST/PUT /asambleas/:id/detalles`

### F5. Eventos
- Pantalla: Lista de eventos *(N1-N5)* → `GET /eventos`
- Pantalla: Detalle de evento *(N1-N5)* → `GET /eventos/:id`
- Pantalla: Formulario evento (crear/editar) *(N1, N2)* → `POST/PUT /eventos`

### F6. Asistencias
- Pantalla: Lista de asistencias por evento *(N1-N4)* → `GET /eventos/:id/asistencias`
- Pantalla: Formulario registrar/editar asistencia *(N1, N2, N4)* → `POST/PUT /eventos/:id/asistencias`

### F7. Multas
- Pantalla: Lista de multas *(N1-N4)* → `GET /multas`
- Pantalla: Detalle de multa *(N1-N4)* → `GET /multas/:id`
- Pantalla: Formulario multa manual (crear/editar) *(N1, N2, N3)* → `POST/PUT /multas`
- Pantalla: Estado de multas por padre *(N1-N4)* → `GET /padres/:id/multas`
- Proceso de sistema: generación automática *(N6)* → `POST /multas/generar`

### F8. Ingresos
- Pantalla: Lista de ingresos *(N1, N2, N3)* → `GET /ingresos`
- Pantalla: Detalle de ingreso *(N1, N2, N3)* → `GET /ingresos/:id`
- Pantalla: Formulario ingreso (crear/editar) *(N1, N2, N3)* → `POST/PUT /ingresos`
- Pantalla: Historial de ingresos por padre *(N1, N2, N3)* → `GET /padres/:id/ingresos`
- Pantalla: Panel de totales *(N1, N2, N3)* → `GET /ingresos/panel-totales`
- Pantalla: Estado ingresos y multas por padre *(N1, N2, N3)* → `GET /padres/:id/estado-financiero`

### F9. Gastos
- Pantalla: Lista de gastos *(N1, N2, N3)* → `GET /gastos`
- Pantalla: Detalle de gasto *(N1, N2, N3)* → `GET /gastos/:id`
- Pantalla: Formulario comprobante *(N1, N2, N3)* → `POST/PUT /comprobantes`
- Pantalla: Formulario item de gasto *(N1, N2, N3)* → `POST/PUT /comprobantes/:id/items`
- Pantalla: Formulario gasto *(N1, N2, N3)* → `POST/PUT /gastos`

### F10. Movimientos y Reportes Financieros
- Pantalla: Lista de movimientos *(N1, N2, N3)* → `GET /movimientos`
- Pantalla: Detalle de movimiento *(N1, N2, N3)* → `GET /movimientos/:id`
- Pantalla: Balance general *(N1, N2, N3)* → `GET /movimientos/balance`
- Pantalla: Generar/exportar reporte *(N1, N2, N3)* → `GET /reportes/financiero`, `/export`

### F11. Avisos
- Pantalla: Lista de avisos *(N1-N5)* → `GET /avisos`
- Pantalla: Detalle de aviso *(N1-N5)* → `GET /avisos/:id`

---

## 4. Resumen de pantallas por actor

| Actor | Módulos visibles |
|---|---|
| N1 Administrador | Todos (F1–F11) |
| N2 Presidente/Vicepresidente | Todos excepto Gestión de roles |
| N3 Tesorero | F1 (login/logout), F7 (multas: ver, registrar/editar manual), F8, F9, F10 |
| N4 Secretario/Vocal | F1 (login/logout), F2 (lectura), F3 (lectura), F4 (lectura + detalle), F5 (lectura), F6, F7 (lectura) |
| N5 Padre | F1 (login/logout), F5 (lectura eventos), F11 (avisos) |
| N6 Sistema | Solo `POST /multas/generar` (sin pantalla) |

---
