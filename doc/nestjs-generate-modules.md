# Generación de Módulos NestJS

Comandos para generar la estructura completa del proyecto según los 11 módulos (71 endpoints).

## Estructura Base

```bash
# Módulos core (no requieren endpoints REST)
nest g module auth
nest g module common
nest g module prisma

# Guards y decorators
nest g guard auth/firebase-auth
nest g guard auth/roles
nest g decorator auth/roles

# Filters
nest g filter filters/http-exception
nest g filter filters/prisma-exception

# Interceptors
nest g interceptor interceptors/logging
nest g interceptor interceptors/audit

# Pipes
nest g pipe pipes/validation
```

---

## M1 — Autenticación y Roles (5 endpoints)

```bash
nest g module auth
nest g controller auth --no-spec
nest g service auth --no-spec
nest g service auth/firebase --no-spec
nest g service auth/jwt --no-spec
nest g dto auth/dto/login
nest g dto auth/dto/register
```

---

## M2 — Padres y Estudiantes (11 endpoints)

```bash
# Padres
nest g module parents
nest g controller parents --no-spec
nest g service parents --no-spec
nest g dto parents/dto/create-parent
nest g dto parents/dto/update-parent
nest g dto parents/dto/query-parent

# Estudiantes
nest g module students
nest g controller students --no-spec
nest g service students --no-spec
nest g dto students/dto/create-student
nest g dto students/dto/update-student
nest g dto students/dto/query-student
```

---

## M3 — Directiva (5 endpoints)

```bash
nest g module board
nest g controller board --no-spec
nest g service board --no-spec
nest g dto board/dto/create-board-member
nest g dto board/dto/update-board-member
nest g dto board/dto/query-board-member
```

---

## M4 — Asambleas (8 endpoints)

```bash
nest g module assemblies
nest g controller assemblies --no-spec
nest g service assemblies --no-spec
nest g dto assemblies/dto/create-assembly
nest g dto assemblies/dto/update-assembly
nest g dto assemblies/dto/create-assembly-detail
nest g dto assemblies/dto/update-assembly-detail
```

---

## M5 — Eventos (5 endpoints)

```bash
nest g module events
nest g controller events --no-spec
nest g service events --no-spec
nest g dto events/dto/create-event
nest g dto events/dto/update-event
nest g dto events/dto/query-event
```

---

## M6 — Asistencias (3 endpoints)

```bash
nest g module attendance
nest g controller attendance --no-spec
nest g service attendance --no-spec
nest g dto attendance/dto/create-attendance
nest g dto attendance/dto/update-attendance
```

---

## M7 — Multas (7 endpoints)

```bash
nest g module fines
nest g controller fines --no-spec
nest g service fines --no-spec
nest g dto fines/dto/create-fine
nest g dto fines/dto/update-fine
nest g dto fines/dto/generate-fines
nest g dto fines/dto/query-fine
```

---

## M8 — Ingresos (8 endpoints)

```bash
nest g module income
nest g controller income --no-spec
nest g service income --no-spec
nest g dto income/dto/create-income
nest g dto income/dto/update-income
nest g dto income/dto/pay-fine
nest g dto income/dto/contribution
nest g dto income/dto/query-income
```

---

## M9 — Gastos (11 endpoints)

```bash
nest g module expenses
nest g controller expenses --no-spec
nest g service expenses --no-spec
nest g dto expenses/dto/create-expense
nest g dto expenses/dto/update-expense
nest g dto expenses/dto/create-event-expense
nest g dto expenses/dto/create-fixed-expense
nest g dto expenses/dto/query-expense
```

---

## M10 — Movimientos y Reportes (6 endpoints)

```bash
nest g module transactions
nest g controller transactions --no-spec
nest g service transactions --no-spec
nest g dto transactions/dto/query-transaction

nest g module reports
nest g controller reports --no-spec
nest g service reports --no-spec
nest g dto reports/dto/query-report
```

---

## M11 — Avisos (2 endpoints)

```bash
nest g module notices
nest g controller notices --no-spec
nest g service notices --no-spec
nest g dto notices/dto/query-notice
```

---

## Comando Total (copiar y pegar)

```bash
# === ESTRUCTURA CORE ===
nest g module auth
nest g module common
nest g module prisma
nest g guard auth/firebase-auth
nest g guard auth/roles
nest g decorator auth/roles
nest g filter filters/http-exception
nest g filter filters/prisma-exception
nest g interceptor interceptors/logging
nest g interceptor interceptors/audit
nest g pipe pipes/validation

# === M1: AUTENTICACIÓN ===
nest g module auth
nest g controller auth --no-spec
nest g service auth --no-spec
nest g service auth/firebase --no-spec
nest g service auth/jwt --no-spec
nest g dto auth/dto/login
nest g dto auth/dto/register

# === M2: PADRES Y ESTUDIANTES ===
nest g module parents
nest g controller parents --no-spec
nest g service parents --no-spec
nest g dto parents/dto/create-parent
nest g dto parents/dto/update-parent
nest g dto parents/dto/query-parent

nest g module students
nest g controller students --no-spec
nest g service students --no-spec
nest g dto students/dto/create-student
nest g dto students/dto/update-student
nest g dto students/dto/query-student

# === M3: DIRECTIVA ===
nest g module board
nest g controller board --no-spec
nest g service board --no-spec
nest g dto board/dto/create-board-member
nest g dto board/dto/update-board-member
nest g dto board/dto/query-board-member

# === M4: ASAMBLEAS ===
nest g module assemblies
nest g controller assemblies --no-spec
nest g service assemblies --no-spec
nest g dto assemblies/dto/create-assembly
nest g dto assemblies/dto/update-assembly
nest g dto assemblies/dto/create-assembly-detail
nest g dto assemblies/dto/update-assembly-detail

# === M5: EVENTOS ===
nest g module events
nest g controller events --no-spec
nest g service events --no-spec
nest g dto events/dto/create-event
nest g dto events/dto/update-event
nest g dto events/dto/query-event

# === M6: ASISTENCIAS ===
nest g module attendance
nest g controller attendance --no-spec
nest g service attendance --no-spec
nest g dto attendance/dto/create-attendance
nest g dto attendance/dto/update-attendance

# === M7: MULTAS ===
nest g module fines
nest g controller fines --no-spec
nest g service fines --no-spec
nest g dto fines/dto/create-fine
nest g dto fines/dto/update-fine
nest g dto fines/dto/generate-fines
nest g dto fines/dto/query-fine

# === M8: INGRESOS ===
nest g module income
nest g controller income --no-spec
nest g service income --no-spec
nest g dto income/dto/create-income
nest g dto income/dto/update-income
nest g dto income/dto/pay-fine
nest g dto income/dto/contribution
nest g dto income/dto/query-income

# === M9: GASTOS ===
nest g module expenses
nest g controller expenses --no-spec
nest g service expenses --no-spec
nest g dto expenses/dto/create-expense
nest g dto expenses/dto/update-expense
nest g dto expenses/dto/create-event-expense
nest g dto expenses/dto/create-fixed-expense
nest g dto expenses/dto/query-expense

# === M10: MOVIMIENTOS Y REPORTES ===
nest g module transactions
nest g controller transactions --no-spec
nest g service transactions --no-spec
nest g dto transactions/dto/query-transaction

nest g module reports
nest g controller reports --no-spec
nest g service reports --no-spec
nest g dto reports/dto/query-report

# === M11: AVISOS ===
nest g module notices
nest g controller notices --no-spec
nest g service notices --no-spec
nest g dto notices/dto/query-notice
```

---

## Resumen

| Módulo | Controllers | Services | DTOs |
|--------|-------------|----------|------|
| Core | - | 2 (firebase, jwt) | - |
| M1 Auth | 1 | 2 | 2 |
| M2 Parents/Students | 2 | 2 | 6 |
| M3 Board | 1 | 1 | 3 |
| M4 Assemblies | 1 | 1 | 4 |
| M5 Events | 1 | 1 | 3 |
| M6 Attendance | 1 | 1 | 2 |
| M7 Fines | 1 | 1 | 4 |
| M8 Income | 1 | 1 | 5 |
| M9 Expenses | 1 | 1 | 5 |
| M10 Transactions/Reports | 2 | 2 | 2 |
| M11 Notices | 1 | 1 | 1 |
| **Total** | **14** | **16** | **37** |
