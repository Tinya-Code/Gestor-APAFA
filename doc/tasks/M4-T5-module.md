# M4 — T5: Módulo NestJS

**Módulo:** Asambleas
**Archivo a crear:** `src/modules/assemblies/assemblies.module.ts`
**Archivo a modificar:** `src/app.module.ts`
**Referencia:** `src/modules/directiva/directiva.module.ts` (patrón de módulo)

> **⚠️ NOTA:** El `directiva.module.ts` real exporta `ReemplazosService` (no `DirectivaService`). Este task sigue el patrón general de module con `imports: [AuthModule]`, `controllers`, `providers`, `exports`.

---

## Contexto general

Un módulo en NestJS agrupa controladores, servicios y proveedores relacionados. El módulo le dice a NestJS cómo crear y conectar las dependencias.

### Por qué importar AuthModule

El módulo `AuthModule` exporta `JwtAuthGuard` y `RolesGuard`. Cuando usas `@UseGuards(JwtAuthGuard, RolesGuard)` en el controlador, NestJS necesita encontrar esos guards en el módulo actual o en sus importaciones.

**Sin importar `AuthModule`:**
```
Nest can't resolve dependencies of the AssembliesController (?, ?)
Please make sure that the argument JwtAuthGuard at index [0] is available in the AssembliesModule context.
```

**Con importar `AuthModule`:**
NestJS resuelve los guards correctamente porque `AuthModule` los exporta.

### Por qué NO importar TypeOrmModule

Este proyecto NO usa TypeORM. Usa `DatabaseService` que se inyecta globalmente desde `DatabaseModule`. No hay repositorios TypeORM que declarar.

### Por qué DatabaseService no se importa

`DatabaseService` se registra como `global: true` en `DatabaseModule`. Esto significa que está disponible en TODOS los módulos sin necesidad de importarlo explícitamente.

---

## T5.1 — Crear módulo de asambleas

Crear `src/modules/assemblies/assemblies.module.ts`.

### Estructura completa

```typescript
import { Module } from '@nestjs/common';
import { AssembliesController } from './assemblies.controller';
import { AssembliesService } from './assemblies.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AssembliesController],
  providers: [AssembliesService],
  exports: [AssembliesService],
})
export class AssembliesModule {}
```

### Explicación de cada sección

- **`imports: [AuthModule]`** — Importa el módulo de autenticación para que los guards estén disponibles. Es OBLIGATORIO si el controlador usa `@UseGuards()`.

- **`controllers: [AssembliesController]`** — Declara el controlador que maneja las rutas HTTP.

- **`providers: [AssembliesService]`** — Declara el servicio que contiene la lógica de negocio. NestJS lo crea una vez (singleton) y lo inyecta en el controlador.

- **`exports: [AssembliesService]`** — Exporta el servicio para que otros módulos puedan inyectarlo. Útil si `AssembliesService` se usa en otros servicios (ej: `ReportsService` para generar reportes de asambleas).

### Criterios de aceptación

- [ ] Archivo `assemblies.module.ts` creado
- [ ] Importa `AuthModule`
- [ ] NO importa `TypeOrmModule`
- [ ] Controlador y servicio declarados
- [ ] Servicio exportado para uso externo
- [ ] Estructura idéntica a `directiva.module.ts`

---

## T5.2 — Registrar módulo en AppModule

Modificar `src/app.module.ts` para agregar `AssembliesModule`.

### Ubicación actual de módulos en app.module.ts

El archivo `src/app.module.ts` tiene los módulos en este orden aproximado:

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    FirebaseModule,
    AdminModule,
    ParentsModule,
    StudentsModule,
    DirectivaModule,
    // ... otros módulos
  ],
})
```

### Pasos

1. Agregar import de `AssembliesModule` desde `./modules/assemblies/assemblies.module`
2. Agregar `AssembliesModule` al array `imports` después de `DirectivaModule`
3. Verificar que compile sin errores con `npx tsc --noEmit`

### Ejemplo de cambio

```typescript
// Antes
import { DirectivaModule } from './modules/directiva/directiva.module';

// Después
import { DirectivaModule } from './modules/directiva/directiva.module';
import { AssembliesModule } from './modules/assemblies/assemblies.module';
```

```typescript
// En el array imports
DirectivaModule,
AssembliesModule,  // ← Agregar aquí
```

### Criterios de aceptación

- [ ] `AssembliesModule` agregado a `app.module.ts`
- [ ] Import correcto desde la ruta adecuada
- [ ] El archivo compila sin errores
- [ ] El módulo está disponible en la aplicación

---

## Notas importantes

1. **Order de módulos:** No importa el orden en `imports`, pero por consistencia se colocan en orden alfabético o agrupados por funcionalidad.

2. **Módulos globales:** `DatabaseModule` y `ConfigModule` usan `isGlobal: true`. Los demás módulos son locales y solo están disponibles donde se importan.

3. **Lazy loading:** NestJS no soporta lazy loading de módulos por defecto. Todos los módulos se cargan al iniciar la aplicación.

4. **Unmounted modules:** Si un módulo no se usa, NestJS no lo carga. No hay problema en declarar módulos adicionales "por si acaso".

5. **Testing:** Para tests, se pueden crear módulos mock con `Test.createTestingModule()`. Los módulos exportados son más fáciles de mockear.
