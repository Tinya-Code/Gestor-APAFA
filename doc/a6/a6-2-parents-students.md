# A6 M2 — Padres y Estudiantes

---

## GET `/api/v1/parents`

**Descripción:** Lista padres con paginación y filtros.

**Actores:** N1–N4

**Pseudocódigo:**
```javascript
function listParents(page, limit, search) {
  // Recibe: número de página, límite de resultados y término de búsqueda

  // Consulta: padres en la base de datos
  // Si hay búsqueda: filtra por nombre, apellido o DNI
  // Incluye: cantidad de estudiantes vinculados a cada padre

  // Devuelve: lista de padres paginada con cantidad total de registros
}
```

**Parámetros de consulta:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| page | integer | No | Número de página (default: 1) |
| limit | integer | No | Resultados por página (default: 20) |
| search | string | No | Buscar por nombre, apellido o DNI |

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "María",
      "surname": "García",
      "dni": "30123456",
      "phone": "+54 11 2345-6789",
      "email": "maria@ejemplo.com",
      "students_count": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

## GET `/api/v1/parents/:id`

**Descripción:** Retorna el detalle de un padre con sus estudiantes vinculados.

**Actores:** N1–N4

**Pseudocódigo:**
```javascript
function getParent(parentId) {
  // Recibe: id del padre

  // Consulta: los datos completos del padre
  // Consulta: todos los estudiantes vinculados a ese padre

  // Devuelve: el padre con su lista de estudiantes
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del padre |

**Respuesta (200):**
```json
{
  "data": {
    "id": 1,
    "name": "María",
    "surname": "García",
    "dni": "30123456",
    "phone": "+54 11 2345-6789",
    "email": "maria@ejemplo.com",
    "students": [
      {
        "id": 1,
        "name": "Sofía",
        "surname": "García",
        "grade": "3ro",
        "section": "A"
      }
    ]
  }
}
```

**Errores:**
| Código | Descripción |
|--------|-------------|
| 404 | Padre no encontrado |

---

## POST `/api/v1/parents`

**Descripción:** Registra un nuevo padre.

**Actores:** N1, N2

**Pseudocódigo:**
```javascript
function createParent(data) {
  // Recibe: nombre, apellido, DNI, teléfono y email del padre

  // Valida: que los campos obligatorios estén presentes
  // Valida: que el DNI no esté duplicado

  // Procesa: crea el registro del padre en la base de datos

  // Devuelve: el padre creado con su id y fecha de creación
}
```

**Cuerpo de la solicitud:**
```json
{
  "name": "María",
  "surname": "García",
  "dni": "30123456",
  "phone": "+54 11 2345-6789",
  "email": "maria@ejemplo.com"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | string | ✅ | Nombre del padre |
| surname | string | ✅ | Apellido del padre |
| dni | string | ✅ | Documento nacional de identidad (único) |
| phone | string | No | Número de teléfono |
| email | string | No | Dirección de email |

**Respuesta (201):**
```json
{
  "data": {
    "id": 1,
    "name": "María",
    "surname": "García",
    "dni": "30123456",
    "phone": "+54 11 2345-6789",
    "email": "maria@ejemplo.com",
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

**Errores:**
| Código | Descripción |
|--------|-------------|
| 403 | Permisos insuficientes |
| 422 | Error de validación (campos faltantes o DNI duplicado) |

---

## PUT `/api/v1/parents/:id`

**Descripción:** Edita un padre existente.

**Actores:** N1, N2

**Pseudocódigo:**
```javascript
function updateParent(parentId, data) {
  // Recibe: id del padre y campos a actualizar

  // Valida: que el padre exista
  // Valida: si se cambia el DNI, que no esté duplicado

  // Procesa: actualiza solo los campos proporcionados

  // Devuelve: el padre actualizado
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del padre |

**Cuerpo de la solicitud:** Igual que POST (todos los campos opcionales — solo se actualizan los proporcionados).

**Respuesta (200):** Mismo formato que POST.

**Errores:**
| Código | Descripción |
|--------|-------------|
| 403 | Permisos insuficientes |
| 404 | Padre no encontrado |
| 422 | Error de validación |

---

## DELETE `/api/v1/parents/:id`

**Descripción:** Elimina un padre.

**Actores:** N1

**Pseudocódigo:**
```javascript
function deleteParent(parentId) {
  // Recibe: id del padre

  // Valida: que el usuario sea administrador (N1)
  // Valida: que el padre exista

  // Procesa: elimina el registro del padre
  // Nota: los estudiantes vinculados quedan huérfanos
  // (se debería decidir política: CASCADE o SET NULL)

  // Devuelve: confirmación de eliminación
}
```

**Respuesta (200):**
```json
{
  "data": {
    "message": "Padre eliminado exitosamente"
  }
}
```

**Errores:**
| Código | Descripción |
|--------|-------------|
| 403 | Permisos insuficientes |
| 404 | Padre no encontrado |

---

## GET `/api/v1/students`

**Descripción:** Lista estudiantes con filtros.

**Actores:** N1–N4

**Pseudocódigo:**
```javascript
function listStudents(page, limit, grade, section, parentId) {
  // Recibe: paginación y filtros opcionales (grado, sección, padre)

  // Consulta: estudiantes en la base de datos
  // Aplica filtros si se proporcionan
  // Incluye: nombre del padre vinculado

  // Devuelve: lista de estudiantes paginada
}
```

**Parámetros de consulta:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| page | integer | No | Número de página |
| limit | integer | No | Resultados por página |
| grade | string | No | Filtrar por grado |
| section | string | No | Filtrar por sección |
| parent_id | integer | No | Filtrar por padre |

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Sofía",
      "surname": "García",
      "grade": "3ro",
      "section": "A",
      "parent_id": 1,
      "parent_name": "María García"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "total_pages": 6
  }
}
```

---

## GET `/api/v1/students/:id`

**Descripción:** Retorna el detalle de un estudiante.

**Actores:** N1–N4

**Pseudocódigo:**
```javascript
function getStudent(studentId) {
  // Recibe: id del estudiante

  // Consulta: los datos completos del estudiante
  // Consulta: el padre vinculado

  // Devuelve: el estudiante con información de su padre
}
```

**Respuesta (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Sofía",
    "surname": "García",
    "grade": "3ro",
    "section": "A",
    "parent_id": 1,
    "parent": {
      "id": 1,
      "name": "María",
      "surname": "García"
    }
  }
}
```

---

## POST `/api/v1/students`

**Descripción:** Registra un nuevo estudiante.

**Actores:** N1, N2

**Pseudocódigo:**
```javascript
function createStudent(data) {
  // Recibe: nombre, apellido, grado, sección y id del padre

  // Valida: que los campos obligatorios estén presentes
  // Valida: que el padre exista

  // Procesa: crea el registro del estudiante vinculado al padre

  // Devuelve: el estudiante creado con su id
}
```

**Cuerpo de la solicitud:**
```json
{
  "name": "Sofía",
  "surname": "García",
  "grade": "3ro",
  "section": "A",
  "parent_id": 1
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | string | ✅ | Nombre del estudiante |
| surname | string | ✅ | Apellido del estudiante |
| grade | string | ✅ | Nivel escolar |
| section | string | ✅ | Sección |
| parent_id | integer | ✅ | ID del padre |

**Respuesta (201):** Objeto estudiante con `id` y `created_at`.

---

## PUT `/api/v1/students/:id`

**Descripción:** Edita un estudiante.

**Actores:** N1, N2

**Pseudocódigo:**
```javascript
function updateStudent(studentId, data) {
  // Recibe: id del estudiante y campos a actualizar

  // Valida: que el estudiante exista

  // Procesa: actualiza solo los campos proporcionados

  // Devuelve: el estudiante actualizado
}
```

**Cuerpo de la solicitud:** Igual que POST (todos los campos opcionales).

**Respuesta (200):** Objeto estudiante actualizado.

---

## DELETE `/api/v1/students/:id`

**Descripción:** Elimina un estudiante.

**Actores:** N1

**Pseudocódigo:**
```javascript
function deleteStudent(studentId) {
  // Recibe: id del estudiante

  // Valida: que el usuario sea administrador (N1)
  // Valida: que el estudiante exista

  // Procesa: elimina el registro del estudiante

  // Devuelve: confirmación de eliminación
}
```

**Respuesta (200):**
```json
{
  "data": {
    "message": "Estudiante eliminado exitosamente"
  }
}
```

---

## PATCH `/api/v1/students/:id/parent`

**Descripción:** Asocia o reasigna un estudiante a un padre.

**Actores:** N1, N2

**Pseudocódigo:**
```javascript
function assignStudentToParent(studentId, newParentId) {
  // Recibe: id del estudiante y id del nuevo padre

  // Valida: que el estudiante exista
  // Valida: que el nuevo padre exista

  // Procesa: actualiza la referencia parent_id del estudiante

  // Devuelve: el estudiante con el nuevo padre asignado
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del estudiante |

**Cuerpo de la solicitud:**
```json
{
  "parent_id": 3
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| parent_id | integer | ✅ | ID del nuevo padre |

**Respuesta (200):** Objeto estudiante con nueva referencia al padre.

**Errores:**
| Código | Descripción |
|--------|-------------|
| 404 | Estudiante o padre no encontrado |
| 422 | Error de validación |
