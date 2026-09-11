# A2 — Entidades y Atributos (Multi-Tenant)

> **Modelo Multi-Tenant:** Todas las tablas de dominio tienen `colegio_id`.
> Cada usuario solo ve y gestiona los datos de SU colegio.
> El super_admin (desarrollador) puede acceder a TODOS los colegios.

---

## 🏫 Colegio (Tenant)

| Propiedad | Descripción                             |
| --------- | --------------------------------------- |
| id        | Identificador único del colegio         |
| name      | Nombre del colegio                      |
| slug      | URL-friendly (ej: "colegio-san-miguel") |
| address   | Dirección del colegio                   |
| phone     | Teléfono de contacto                    |
| email     | Correo electrónico                      |
| logo_url  | URL del logo                            |
| is_active | Si el colegio está activo               |

> **Regla:** El slug es único. Se usa en URLs y para identificar al colegio de forma friendly.

---

## 👤 Usuario

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del usuario |
| email | Correo electrónico (único globalmente) |
| password_hash | Hash de contraseña (para login local) |
| firebase_uid | UID de Firebase Auth (para login Firebase) |
| name | Nombre del usuario |
| surname | Apellido del usuario |
| phone | Teléfono |
| is_super_admin | Si es super_admin (acceso a TODOS los colegios) |

> **Regla:** Un usuario puede pertenecer a múltiples colegios con distintos roles.
> El super_admin NO tiene colegio asociado — accede a todos.

---

## 🔗 Usuario ↔ Colegio (relación N:N)

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único de la relación |
| usuario_id | Referencia al usuario |
| colegio_id | Referencia al colegio |
| role | Rol del usuario EN ese colegio |
| is_active | Si la relación está activa |

**Roles posibles:**

| Rol | Descripción |
|-----|-------------|
| `presidente` | Presidente de la APAFA |
| `vicepresidente` | Vicepresidente de la APAFA |
| `tesorero` | Tesorero de la APAFA |
| `secretario` | Secretario de la APAFA |
| `vocal` | Vocal (solo lectura) |
| `padre` | Padre de familia (acceso limitado) |

> **Regla:** La combinación (usuario_id, colegio_id) es única.
> Un usuario no puede tener dos roles en el mismo colegio.

---

## 👨‍👩‍👧 Padre

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del padre o madre |
| **colegio_id** | **Colegio al que pertenece** |
| usuario_id | Link con usuario (si se registró en el sistema) |
| name | Nombre del padre o madre |
| surname | Apellido del padre o madre |
| dni | Documento nacional de identidad |
| phone | Número de contacto telefónico |
| email | Correo electrónico registrado |

> **UNIQ:** (dni, colegio_id) — Un mismo DNI puede existir en distintos colegios.
> **Regla:** Las queries SIEMPRE filtran por `colegio_id`.

---

## 🎓 Estudiante

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del estudiante |
| **colegio_id** | **Colegio al que pertenece** |
| name | Nombre del estudiante |
| surname | Apellido del estudiante |
| grade | Nivel escolar que cursa |
| section | Grupo o sección asignada |
| parent_id | Referencia al padre o madre responsable |

> **Regla:** Las queries SIEMPRE filtran por `colegio_id`.

---

## 🏛️ Directiva (Mandatos)

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del mandato |
| **colegio_id** | **Colegio al que pertenece** |
| parent_id | Padre que ocupa el cargo |
| role | Cargo de la directiva (presidente, vicepresidente, tesorero, secretario, vocal) |
| start_date | Fecha de inicio del mandato |
| end_date | Fecha de fin (NULL = mandato vigente) |
| notes | Notas sobre el mandato |
| is_active | Estado del mandato (1=activo, 0=inactivo) |

> **Regla:** Las queries SIEMPRE filtran por `colegio_id`.
> **Unique Key:** (parent_id, colegio_id, role) — un padre no puede tener 2 mandatos activos del mismo rol.

---

## 🗓️ Tablas de Fases Futuras (M4–M11)

> Las siguientes tablas están documentadas en el diseño pero se implementarán en fases posteriores (M4–M11). Todas tendrán `colegio_id` para aislamiento multi-tenant.

| Tabla | Módulo | Descripción |
|-------|--------|-------------|
| asamblea | M4 | Asambleas del colegio |
| detalle_asamblea | M4 | Detalles/acuerdos de cada asamblea |
| evento | M5 | Eventos del colegio |
| asistencia | M6 | Registro de asistencia a eventos |
| multa | M7 | Multas por inasistencia |
| ingreso | M8 | Ingresos/aportes económicos |
| comprobante | M9 | Comprobantes de gastos |
| item_gasto | M9 | Ítems detallados de cada gasto |
| gasto | M9 | Gastos del colegio |
| movimiento | M10 | Movimientos financieros (ingreso/egreso) |
| aviso | M11 | Avisos/notificaciones del colegio |

> **Nota:** Estas tablas NO existen aún en `schema-current.sql`. Se crearán cuando se implementen los módulos correspondientes.

### Reglas de Seguridad

**Super Admin (desarrollador):**
- `is_super_admin = true` en tabla `usuario`
- NO tiene colegio asociado
- Accede a TODOS los colegios desde un panel especial
- **NUNCA** aparece en listados de padres o directiva

**Otros roles:**
- Acceso según la tabla de permisos
- Siempre filtrados por `colegio_id`

---

## 🗓️ Asamblea

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único de la asamblea |
| **colegio_id** | **Colegio al que pertenece** |
| title | Tema o nombre de la reunión |
| date | Día en que se realiza la asamblea |
| description | Detalle o resumen de los temas tratados |

## 📋 Detalle de Asamblea

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del detalle |
| **colegio_id** | **Colegio al que pertenece** |
| assembly_id | Referencia a la asamblea correspondiente |
| description | Nota o acuerdo registrado |
| registration_date | Fecha en que se registró el detalle |
| image_url | Foto de la acta |

## 🎉 Evento

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del evento |
| **colegio_id** | **Colegio al que pertenece** |
| assembly_id | Relación con una asamblea (si aplica) |
| title | Nombre del evento |
| date | Día en que se realiza |
| description | Breve explicación del evento |
| generates_fine | Indica si el evento genera multa por inasistencia |
| fine_amount | Valor de la multa (si aplica) |
| generates_attendance | Indica si se registra asistencia |
| generates_expense | Indica si el evento implica gastos |
| generates_contribution | Indica si se recaudan aportes |
| contribution_amount | Valor del aporte (si aplica) |

## ✅ Asistencia

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del registro |
| **colegio_id** | **Colegio al que pertenece** |
| event_id | Evento al que corresponde la asistencia |
| parent_id | Padre o madre registrado |
| attended | Indica si asistió o no |
| registration_date | Fecha en que se registró la asistencia |

## 💸 Multa

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único de la multa |
| **colegio_id** | **Colegio al que pertenece** |
| parent_id | Padre o madre sancionado |
| event_id | Evento que generó la multa |
| amount | Valor de la multa |
| paid | Estado del pago (sí/no) |
| generated_date | Fecha en que se generó la multa |
| payment_date | Fecha del pago (si se realizó) |

## 💰 Ingreso

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del ingreso |
| **colegio_id** | **Colegio al que pertenece** |
| parent_id | Padre o madre que realiza el aporte |
| event_id | Evento asociado (si aplica) |
| board_member_id | Directivo que registra el ingreso |
| amount | Valor del aporte |
| date | Fecha del aporte |
| description | Motivo o detalle del aporte |
| type | donación, multa, aporte voluntario, cuota periódica |

## 🧾 Comprobante

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del comprobante |
| **colegio_id** | **Colegio al que pertenece** |
| board_member_id | Directivo responsable del registro |
| receipt_number | Número del documento (factura o boleta) |
| type | Tipo de comprobante emitido |
| date | Fecha de emisión |
| description | Detalle del gasto o compra |

## 🧮 Item de Gasto

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del ítem |
| **colegio_id** | **Colegio al que pertenece** |
| receipt_id | Comprobante al que pertenece |
| description | Detalle del gasto específico |
| amount | Valor del ítem |

## 🏗️ Gasto

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del gasto |
| **colegio_id** | **Colegio al que pertenece** |
| event_id | Evento asociado (si aplica) |
| receipt_id | Comprobante que respalda el gasto |
| board_member_id | Directivo que autoriza o registra |
| total | Monto total del gasto |
| type | Categoría del gasto (mantenimiento, actividad, etc.) |
| date | Fecha del gasto |
| description | Detalle del gasto realizado |

## 🔄 Movimiento

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del movimiento |
| **colegio_id** | **Colegio al que pertenece** |
| type | Tipo de movimiento (ingreso o egreso) |
| amount | Valor del movimiento |
| date | Fecha del registro |
| description | Detalle del movimiento |
| reference_id | Identificador del registro relacionado |
| reference_type | Tipo de referencia (aporte, multa o gasto) |

## 📢 Aviso

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del aviso |
| **colegio_id** | **Colegio al que pertenece** |
| type | Tipo de aviso (evento o multa) |
| reference_id | Registro al que hace referencia |
| title | Título del aviso |
| message | Contenido o texto del aviso |
| date | Fecha de publicación del aviso |

---

## Resumen: Tablas con `colegio_id`

| Tabla | Estado | ¿Tiene colegio_id? | Unique Key con colegio_id |
|-------|--------|:-------------------:|---------------------------|
| colegio | ✅ Implementada | — (es el tenant) | slug |
| usuario | ✅ Implementada | — (global) | email, firebase_uid |
| usuario_colegio | ✅ Implementada | ✅ | (usuario_id, colegio_id) |
| padre | ✅ Implementada | ✅ | (dni, colegio_id) |
| estudiante | ✅ Implementada | ✅ | — |
| directiva | ✅ Implementada | ✅ | (parent_id, colegio_id, role) |
| asamblea | ⏳ Futura (M4) | ✅ | — |
| detalle_asamblea | ⏳ Futura (M4) | ✅ | — |
| evento | ⏳ Futura (M5) | ✅ | — |
| asistencia | ⏳ Futura (M6) | ✅ | — |
| multa | ⏳ Futura (M7) | ✅ | — |
| ingreso | ⏳ Futura (M8) | ✅ | — |
| comprobante | ⏳ Futura (M9) | ✅ | — |
| item_gasto | ⏳ Futura (M9) | ✅ | — |
| gasto | ⏳ Futura (M9) | ✅ | — |
| movimiento | ⏳ Futura (M10) | ✅ | — |
| aviso | ⏳ Futura (M11) | ✅ | — |

> **Regla de oro:** TODA tabla de dominio DEBE tener `colegio_id`.
> Las queries SIEMPRE filtran por `colegio_id`.
