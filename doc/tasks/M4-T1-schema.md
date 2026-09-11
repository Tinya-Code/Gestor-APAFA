# M4 — T1: Schema de Base de Datos

**Módulo:** Asambleas
**Archivo a modificar:** `db/schema-current.sql`
**Referencia:** `doc/a2-entidades-atributos.md` (entidades Asamblea y DetalleAsamblea)

---

## Contexto general

El schema del proyecto usa MySQL con estas convenciones que DEBES seguir exactamente:

- **Engine:** InnoDB en todas las tablas
- **Charset:** utf8mb4, collation utf8mb4_unicode_ci
- **Primary keys:** `id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT`
- **Timestamps:** `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`, `updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP`, `deleted_at TIMESTAMP NULL DEFAULT NULL` (soft delete)
- **Foreign keys:** `CONSTRAINT fk_nombre_tabla FOREIGN KEY (columna) REFERENCES tabla_origen(id) ON DELETE RESTRICT`
- **Índices:** `CREATE INDEX idx_nombre ON tabla(columna);`
- **Comentarios:** Cada tabla lleva un comentario con `COMMENT='Descripción de la tabla'`
- **Orden de columnas:** id → campos de negocio → timestamps → soft delete

**IMPORTANTE:** El archivo `db/schema-current.sql` ya tiene tablas existentes. Debes agregar las nuevas tablas AL FINAL del archivo, después de la última tabla existente (`directiva_reemplazo`).

---

## T1.1 — Crear tabla asamblea

Agregar la tabla `asamblea` al final de `db/schema-current.sql`.

### Columnas requeridas

| Columna | Tipo | Constraints | Notas |
|---------|------|-------------|-------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | — |
| `colegio_id` | BIGINT UNSIGNED | NOT NULL, FK → `colegio.id` | ON DELETE RESTRICT |
| `title` | VARCHAR(255) | NOT NULL | Nombre/tema de la asamblea |
| `date` | DATE | NOT NULL | Fecha de realización |
| `description` | TEXT | DEFAULT NULL | Detalle de temas tratados |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | — |
| `updated_at` | TIMESTAMP | auto-update | ON UPDATE CURRENT_TIMESTAMP |
| `deleted_at` | TIMESTAMP | DEFAULT NULL | Soft delete |

### Índices requeridos

```sql
CREATE INDEX idx_asamblea_colegio ON asamblea(colegio_id);
CREATE INDEX idx_asamblea_deleted ON asamblea(deleted_at);
```

### Ejemplo de bloque SQL completo

```sql
-- Tabla de asambleas del colegio
CREATE TABLE asamblea (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  colegio_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_asamblea_colegio FOREIGN KEY (colegio_id) REFERENCES colegio(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Asambleas del colegio';

CREATE INDEX idx_asamblea_colegio ON asamblea(colegio_id);
CREATE INDEX idx_asamblea_deleted ON asamblea(deleted_at);
```

### Criterios de aceptación

- [ ] Tabla `asamblea` creada con todas las columnas
- [ ] Foreign key a `colegio` con ON DELETE RESTRICT
- [ ] Índices en `colegio_id` y `deleted_at`
- [ ] Soft delete habilitado (`deleted_at`)
- [ ] Formato consistente con tablas existentes (verificar en schema actual)

---

## T1.2 — Crear tabla detalle_asamblea

Agregar la tabla `detalle_asamblea` inmediatamente después de `asamblea`.

### Columnas requeridas

| Columna | Tipo | Constraints | Notas |
|---------|------|-------------|-------|
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | — |
| `colegio_id` | BIGINT UNSIGNED | NOT NULL, FK → `colegio.id` | ON DELETE RESTRICT |
| `assembly_id` | BIGINT UNSIGNED | NOT NULL, FK → `asamblea.id` | ON DELETE RESTRICT |
| `description` | TEXT | NOT NULL | Nota o acuerdo registrado |
| `registration_date` | DATE | NOT NULL | Fecha de registro del detalle |
| `image_url` | VARCHAR(500) | DEFAULT NULL | URL foto del acta |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | — |
| `updated_at` | TIMESTAMP | auto-update | ON UPDATE CURRENT_TIMESTAMP |
| `deleted_at` | TIMESTAMP | DEFAULT NULL | Soft delete |

### Índices requeridos

```sql
CREATE INDEX idx_detalle_asamblea_colegio ON detalle_asamblea(colegio_id);
CREATE INDEX idx_detalle_asamblea_assembly ON detalle_asamblea(assembly_id);
CREATE INDEX idx_detalle_asamblea_deleted ON detalle_asamblea(deleted_at);
```

### Ejemplo de bloque SQL completo

```sql
-- Detalles/acuerdos de las asambleas
CREATE TABLE detalle_asamblea (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  colegio_id BIGINT UNSIGNED NOT NULL,
  assembly_id BIGINT UNSIGNED NOT NULL,
  description TEXT NOT NULL,
  registration_date DATE NOT NULL,
  image_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_detalle_asamblea_colegio FOREIGN KEY (colegio_id) REFERENCES colegio(id) ON DELETE RESTRICT,
  CONSTRAINT fk_detalle_asamblea_assembly FOREIGN KEY (assembly_id) REFERENCES asamblea(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Detalles y acuerdos de las asambleas';

CREATE INDEX idx_detalle_asamblea_colegio ON detalle_asamblea(colegio_id);
CREATE INDEX idx_detalle_asamblea_assembly ON detalle_asamblea(assembly_id);
CREATE INDEX idx_detalle_asamblea_deleted ON detalle_asamblea(deleted_at);
```

### Criterios de aceptación

- [ ] Tabla `detalle_asamblea` creada con todas las columnas
- [ ] Foreign key a `colegio` con ON DELETE RESTRICT
- [ ] Foreign key a `asamblea` con ON DELETE RESTRICT
- [ ] Índices en `colegio_id`, `assembly_id` y `deleted_at`
- [ ] Soft delete habilitado (`deleted_at`)

---

## Notas importantes

1. **ON DELETE RESTRICT:** Si intentas borrar un colegio o asamblea que tiene registros hijos, MySQL lanzará un error. Esto es intencional — los datos se borran lógicamente con `deleted_at`, no físicamente.

2. **Soft delete:** La columna `deleted_at` permite "borrar" registros sin perder datos. Cuando `deleted_at` tiene valor, el registro está eliminado. Los queries en el servicio SIEMPRE filtran por `deleted_at IS NULL`.

3. **Coherencia con `colegio_id`:** Ambas tablas tienen `colegio_id` porque el sistema es multi-tenant. Cada colegio solo ve sus propios datos.
