# A8 — Permisos de Frontend por Rol

**Pregunta: ¿Qué ve y puede hacer cada rol en la interfaz?**

> Este documento define qué elementos de UI debe ver o ocultar cada rol en el frontend.
> El backend validará los permisos via `RolesGuard`, pero el frontend debe filtrar la UI para UX.

---

## Matriz de Permisos

### Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Puede ver y acceder |
| 📖 | Solo lectura (ve pero no puede editar) |
| ❌ | No debe ver ni acceder |
| 🔒 | Acceso condicional (requiere reemplazo activo) |

---

## 1. Navegación Principal (Sidebar / Menu)

| Sección | Super Admin | Admin Colegio | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|---------|:-----------:|:-------------:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | ❌ |
| Padres | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | 📖 | ❌ |
| Estudiantes | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | 📖 | ❌ |
| Directiva | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | 📖 | ❌ |
| Reemplazos | ✅ | ✅ | ✅ | 📖 | 📖 | 📖 | 📖 | ❌ |
| Asambleas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | ❌ |
| Eventos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | ❌ |
| Asistencia | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | ❌ |
| Multas | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | ❌ |
| Ingresos | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | ❌ |
| Egresos | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | ❌ |
| Transacciones | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | ❌ |
| Reportes | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | ❌ |
| Avisos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 2. Acciones por Módulo

### 2.1 Padres (M2)

| Acción | Super Admin | Admin | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|--------|:-----------:|:-----:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Ver listado | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | 📖 | ❌ |
| Ver detalle | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | 📖 | ❌ |
| Crear padre | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar padre | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar padre | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 2.2 Estudiantes (M2)

| Acción | Super Admin | Admin | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|--------|:-----------:|:-----:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Ver listado | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | 📖 | ❌ |
| Ver detalle | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | 📖 | ❌ |
| Crear estudiante | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar estudiante | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar estudiante | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 2.3 Directiva (M3)

| Acción | Super Admin | Admin | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|--------|:-----------:|:-----:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Ver listado | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | 📖 | ❌ |
| Ver detalle | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | 📖 | ❌ |
| Asignar miembro | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Editar miembro | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Eliminar miembro | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 2.4 Reemplazos Temporales (M3)

| Acción | Super Admin | Admin | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|--------|:-----------:|:-----:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Ver listado | ✅ | ✅ | ✅ | 📖 | 📖 | 📖 | 📖 | ❌ |
| Ver detalle | ✅ | ✅ | ✅ | 📖 | 📖 | 📖 | 📖 | ❌ |
| Crear reemplazo | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Editar reemplazo | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Finalizar reemplazo | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 2.5 Asambleas (M4)

| Acción | Super Admin | Admin | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|--------|:-----------:|:-----:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Ver listado | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | ❌ |
| Crear asamblea | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Editar asamblea | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Eliminar asamblea | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver acta | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | ❌ |
| Editar acta | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |

### 2.6 Eventos (M5)

| Acción | Super Admin | Admin | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|--------|:-----------:|:-----:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Ver listado | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | ❌ |
| Crear evento | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Editar evento | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Eliminar evento | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 2.7 Asistencia (M6)

| Acción | Super Admin | Admin | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|--------|:-----------:|:-----:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Ver listado | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | ❌ |
| Registrar asistencia | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Editar asistencia | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |

### 2.8 Multas (M7)

| Acción | Super Admin | Admin | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|--------|:-----------:|:-----:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Ver listado | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | ❌ |
| Crear multa | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Editar multa | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Eliminar multa | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Cobrar multa | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | 🔒 | ❌ |

### 2.9 Ingresos (M8)

| Acción | Super Admin | Admin | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|--------|:-----------:|:-----:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Ver listado | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | ❌ |
| Registrar ingreso | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | 🔒 | ❌ |
| Editar ingreso | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | 🔒 | ❌ |
| Eliminar ingreso | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### 2.10 Egresos (M9)

| Acción | Super Admin | Admin | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|--------|:-----------:|:-----:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Ver listado | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | ❌ |
| Registrar egreso | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | 🔒 | ❌ |
| Editar egreso | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | 🔒 | ❌ |
| Eliminar egreso | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Aprobar egreso | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### 2.11 Transacciones / Reportes (M10)

| Acción | Super Admin | Admin | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|--------|:-----------:|:-----:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Ver transacciones | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | ❌ |
| Ver reportes | ✅ | ✅ | ✅ | ✅ | ✅ | 📖 | 📖 | ❌ |
| Exportar reportes | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

### 2.12 Avisos (M11)

| Acción | Super Admin | Admin | Presidente | Vicepresidente | Tesorero | Secretario | Vocal | Padre |
|--------|:-----------:|:-----:|:----------:|:--------------:|:--------:|:----------:|:-----:|:-----:|
| Ver avisos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Crear aviso | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Editar aviso | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Eliminar aviso | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Comportamiento del Vocal con Reemplazo

### Estado Normal (sin reemplazo)

```typescript
// El vocal tiene role = 'vocal'
// Puede ver: listados (solo lectura)
// No puede: crear, editar, eliminar nada

if (user.role === 'vocal') {
  // Mostrar solo elementos de lectura
  // Ocultar botones de acción
}
```

### Con Reemplazo Activo

```typescript
// El vocal tiene effective_role = 'tesorero' (por ejemplo)
// Puede ver Y hacer todo lo que puede hacer el rol reemplazado

if (user.effective_role === 'tesorero') {
  // Mostrar botones de acción de finanzas
  // Ocultar elementos de solo lectura
}
```

### Cómo Obtener el effective_role

```typescript
// El JWT contiene el role original
// El effective_role se calcula en el backend (RolesGuard)

// Opción 1: El backend puede agregar effective_role al JWT
// Opción 2: El frontend puede consultar un endpoint de perfil

// Ejemplo de payload JWT:
{
  "sub": 3,
  "email": "carlos@email.com",
  "role": "vocal",           // Rol original
  "effective_role": "tesorero",  // Rol efectivo (si tiene reemplazo)
  "colegio_id": 1,
  "is_super_admin": false
}
```

### Reglas de UI para Vocal

```typescript
// Helper function para determinar permisos
function getUserPermissions(user: User) {
  const role = user.effective_role || user.role;
  
  return {
    canRead: true,  // Todos los roles pueden leer
    canCreate: ['presidente', 'admin_colegio'].includes(role),
    canEdit: ['presidente', 'admin_colegio'].includes(role),
    canDelete: ['presidente', 'admin_colegio'].includes(role),
    
    // Permisos específicos por módulo
    canAccessFinanzas: ['tesorero', 'presidente', 'admin_colegio'].includes(role),
    canAccessAsistencia: ['secretario', 'presidente', 'admin_colegio'].includes(role),
    canManageDirectiva: ['presidente', 'admin_colegio'].includes(role),
    canManageReemplazos: ['presidente', 'admin_colegio'].includes(role),
  };
}
```

---

## 4. Implementación en Frontend

### 4.1 Estructura de Permisos

```typescript
// src/app/shared/models/user.model.ts
export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  role: string;              // Rol original del JWT
  effective_role?: string;   // Rol efectivo (si tiene reemplazo activo)
  colegio_id: number;
  colegio_name: string;
  is_super_admin: boolean;
}

// src/app/shared/guards/role.guard.ts
export function hasPermission(user: User, action: string, resource: string): boolean {
  const role = user.effective_role || user.role;
  
  // Super admin tiene acceso total
  if (user.is_super_admin) return true;
  
  // Admin colegio tiene acceso total en su colegio
  if (role === 'admin_colegio') return true;
  
  // Verificar permisos específicos
  return PERMISSIONS矩阵[role]?.[resource]?.[action] ?? false;
}
```

### 4.2 Uso en Componentes

```typescript
// src/app/features/finances/finances.component.ts
@Component({ ... })
export class FinancesComponent {
  constructor(private authService: AuthService) {}
  
  get canCreateTransaction(): boolean {
    const user = this.authService.currentUser;
    const role = user.effective_role || user.role;
    return ['tesorero', 'presidente', 'admin_colegio'].includes(role);
  }
  
  get canExportReports(): boolean {
    const user = this.authService.currentUser;
    const role = user.effective_role || user.role;
    return ['tesorero', 'presidente', 'admin_colegio'].includes(role);
  }
}
```

```html
<!-- src/app/features/finances/finances.component.html -->
<div class="finances-page">
  <h1>Finanzas</h1>
  
  <!-- Botón solo visible con permisos -->
  <button *ngIf="canCreateTransaction" (click)="openCreateModal()">
    Registrar Transacción
  </button>
  
  <!-- Listado siempre visible (solo lectura) -->
  <app-transactions-list></app-transactions-list>
  
  <!-- Exportar solo con permisos -->
  <button *ngIf="canExportReports" (click)="exportReport()">
    Exportar PDF
  </button>
</div>
```

### 4.3 Rutas Protegidas

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  {
    path: 'panel/finanzas',
    component: FinancesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['tesorero', 'presidente', 'admin_colegio'] }
  },
  {
    path: 'panel/directiva',
    component: DirectivaComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['presidente', 'admin_colegio'] }
  },
  {
    path: 'panel/reemplazos',
    component: ReemplazosComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['presidente', 'admin_colegio'] }
  },
  // Rutas de solo lectura (todos los roles autenticados)
  {
    path: 'panel/padres',
    component: PadresComponent,
    canActivate: [authGuard],
    data: { readOnly: true }
  },
];
```

---

## 5. Resumen por Rol

### Super Admin
- **Acceso:** Total al sistema
- **UI:** Todo visible, todas las acciones disponibles
- **Nota:** NUNCA debe aparecer en listados de padres o directiva

### Admin Colegio
- **Acceso:** Total en su colegio
- **UI:** Todo visible, todas las acciones disponibles
- **Puede:** Gestionar miembros, reemplazos, finanzas, todo

### Presidente
- **Acceso:** Completo (excepto panel tesorero en lectura)
- **UI:** Todo visible
- **Puede:** Gestionar directiva, reemplazos, asambleas, eventos
- **No puede:** Operaciones financieras de escritura (solo lectura)

### Vicepresidente
- **Acceso:** Igual que presidente
- **UI:** Igual que presidente
- **Puede:** Lo mismo que presidente
- **No puede:** Gestionar directiva (solo presidente/admin)

### Tesorero
- **Acceso:** Operaciones financieras
- **UI:** Panel de finanzas completo, resto en lectura
- **Puede:** Crear/editar ingresos, egresos, multas
- **No puede:** Gestionar directiva, asambleas, reemplazos

### Secretario
- **Acceso:** Toma de notas y asistencia
- **UI:** Eventos y asistencia con escritura, resto en lectura
- **Puede:** Crear/editar eventos, registrar asistencia, editar actas
- **No puede:** Finanzas, directiva, reemplazos

### Vocal
- **Acceso:** Solo lectura (por defecto)
- **UI:** Todo en modo lectura, botones de acción ocultos
- **Con reemplazo:** Accede a permisos del rol reemplazado
- **Ejemplo:** Si reemplaza al tesorero, puede operar finanzas

### Padre
- **Acceso:** Solo avisos
- **UI:** Solo sección de avisos visible
- **Puede:** Ver avisos publicados
- **No puede:** Nada más

---

## 6. Notas para Frontend

1. **Siempre validar en backend** — El frontend filtra UI, pero el backend valida permisos reales
2. **Usar effective_role** — Para mostrar/ocultar elementos, usar `user.effective_role || user.role`
3. **Cache de permisos** — El `effective_role` tiene TTL de 30 segundos, puede cambiar sin logout
4. **Elementos condicionales** — Usar `*ngIf` con helpers de permisos
5. **Rutas protegidas** — Configurar `roleGuard` en rutas críticas
6. **Logging** — En modo desarrollo, loguear cuando un usuario accede a algo que no debería
