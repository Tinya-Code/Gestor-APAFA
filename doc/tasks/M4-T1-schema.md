# M4 — T1: Schema de Base de Datos

**Módulo:** Asambleas
**Archivos a modificar:** `db/schema-current.sql`
**Documentos a revisar:** `doc/a2-entidades-atributos.md` (entidades Asamblea y DetalleAsamblea)

---

## T1.1 — Crear tabla asamblea

Agregar la tabla `asamblea` al archivo `db/schema-current.sql`, debajo de las tablas existentes de directiva.

La tabla debe contener las siguientes columnas:

- `id` — Identificador único, autoincremental, entero positivo sin signo
- `colegio_id` — Identificador del colegio al que pertenece (foreign key a tabla `colegio`)
- `title` — Nombre o tema de la asamblea, texto hasta 255 caracteres, obligatorio
- `date` — Fecha en que se realiza la asamblea, tipo fecha, obligatorio
- `description` — Detalle o resumen de los temas tratados, texto largo, opcional
- `created_at` — Fecha de creación del registro, con valor por defecto la fecha actual
- `updated_at` — Fecha de última actualización, se actualiza automáticamente
- `deleted_at` — Fecha de eliminación lógica, nula por defecto (soft delete)

La tabla debe tener:

- Primary key en `id`
- Índice en `colegio_id` para búsquedas por colegio
- Foreign key que referencie `colegio.id`

**Criterios de aceptación:**

- [ ] Tabla `asamblea` creada con todas las columnas descritas
- [ ] Foreign key a `colegio` funcionando
- [ ] Índice en `colegio_id` creado
- [ ] Soft delete habilitado (`deleted_at`)

---

## T1.2 — Crear tabla detalle_asamblea

Agregar la tabla `detalle_asamblea` al archivo `db/schema-current.sql`, inmediatamente después de la tabla `asamblea`.

La tabla debe contener las siguientes columnas:

- `id` — Identificador único, autoincremental, entero positivo sin signo
- `colegio_id` — Identificador del colegio al que pertenece (foreign key a tabla `colegio`)
- `assembly_id` — Referencia a la asamblea a la que pertenece este detalle (foreign key a tabla `asamblea`)
- `description` — Nota o acuerdo registrado, texto largo, obligatorio
- `registration_date` — Fecha en que se registró el detalle, tipo fecha, obligatorio
- `image_url` — URL de la foto del acta, texto hasta 500 caracteres, opcional
- `created_at` — Fecha de creación del registro, con valor por defecto la fecha actual
- `updated_at` — Fecha de última actualización, se actualiza automáticamente
- `deleted_at` — Fecha de eliminación lógica, nula por defecto (soft delete)

La tabla debe tener:

- Primary key en `id`
- Índice en `colegio_id` para búsquedas por colegio
- Índice en `assembly_id` para búsquedas por asamblea
- Foreign key que referencie `colegio.id`
- Foreign key que referencie `asamblea.id`

**Criterios de aceptación:**

- [ ] Tabla `detalle_asamblea` creada con todas las columnas descritas
- [ ] Foreign key a `colegio` funcionando
- [ ] Foreign key a `asamblea` funcionando
- [ ] Índices en `colegio_id` y `assembly_id` creados
- [ ] Soft delete habilitado (`deleted_at`)
