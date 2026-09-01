# A2 — Entidades y Atributos

---

## 👨‍👩‍👧 Padre

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del padre o madre |
| name | Nombre del padre o madre |
| surname | Apellido del padre o madre |
| dni | Documento nacional de identidad |
| phone | Número de contacto telefónico |
| email | Correo electrónico registrado |

## 🎓 Estudiante

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del estudiante |
| name | Nombre del estudiante |
| surname | Apellido del estudiante |
| grade | Nivel escolar que cursa |
| section | Grupo o sección asignada |
| parent_id | Referencia al padre o madre responsable |

## 🏛️ Directiva

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del miembro directivo |
| parent_id | Padre o madre que ocupa el cargo |
| role | Cargo dentro de la directiva (admin, presidente, tesorero, etc.) |
| start_date | Fecha en que inicia su gestión |
| end_date | Fecha en que termina su gestión |

## 🗓️ Asamblea

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único de la asamblea |
| title | Tema o nombre de la reunión |
| date | Día en que se realiza la asamblea |
| description | Detalle o resumen de los temas tratados |

## 📋 Detalle de Asamblea

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del detalle |
| assembly_id | Referencia a la asamblea correspondiente |
| description | Nota o acuerdo registrado |
| registration_date | Fecha en que se registró el detalle |
| image_url | Foto de la acta |

## 🎉 Evento

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del evento |
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
| event_id | Evento al que corresponde la asistencia |
| parent_id | Padre o madre registrado |
| attended | Indica si asistió o no |
| registration_date | Fecha en que se registró la asistencia |

## 💸 Multa

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único de la multa |
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
| board_member_id | Directivo responsable del registro |
| receipt_number | Número del documento (factura o boleta) |
| type | Tipo de comprobante emitido |
| date | Fecha de emisión |
| description | Detalle del gasto o compra |

## 🧮 Item de Gasto

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del ítem |
| receipt_id | Comprobante al que pertenece |
| description | Detalle del gasto específico |
| amount | Valor del ítem |

## 🏗️ Gasto

| Propiedad | Descripción |
|-----------|-------------|
| id | Identificador único del gasto |
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
| type | Tipo de aviso (evento o multa) |
| reference_id | Registro al que hace referencia |
| title | Título del aviso |
| message | Contenido o texto del aviso |
| date | Fecha de publicación del aviso |

---
