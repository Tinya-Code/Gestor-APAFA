# M4 — T5: Módulo NestJS

**Módulo:** Asambleas
**Archivos a crear:** `src/modules/assemblies/assemblies.module.ts`
**Archivos a modificar:** `src/app.module.ts`
**Documentos a revisar:** `src/modules/directiva/directiva.module.ts` (patrón de módulo existente)

---

## T5.1 — Crear módulo de asambleas

Crear el archivo `src/modules/assemblies/assemblies.module.ts` que integra el controlador, servicio y repositorios.

El módulo debe:

- Importar `TypeOrmModule.forFeature()` con las entidades `Assembly` y `AssemblyDetail` para registrar los repositorios
- Declarar el controlador `AssembliesController`
- Declarar el servicio `AssembliesService`
- Exportar `AssembliesService` para que otros módulos puedan usarlo si es necesario

Estructura del módulo:

```
@Module({
  imports: [TypeOrmModule.forFeature([Assembly, AssemblyDetail])],
  controllers: [AssembliesController],
  providers: [AssembliesService],
  exports: [AssembliesService],
})
export class AssembliesModule {}
```

**Criterios de aceptación:**

- [ ] Archivo `assemblies.module.ts` creado
- [ ] Entidades `Assembly` y `AssemblyDetail` registradas en TypeOrmModule
- [ ] Controlador y servicio declarados
- [ ] Servicio exportado para uso externo

---

## T5.2 — Registrar módulo en AppModule

Modificar el archivo `src/app.module.ts` para agregar `AssembliesModule` a la lista de imports.

Ubicar el array `imports` del decorador `@Module` y agregar `AssembliesModule` junto a los otros módulos del proyecto (AdminModule, ParentsModule, StudentsModule, DirectivaModule).

Verificar que el import de `AssembliesModule` esté correctamente ubicado y que el archivo compile sin errores después de la modificación.

**Criterios de aceptación:**

- [ ] `AssembliesModule` agregado a `app.module.ts`
- [ ] El archivo compila sin errores de importación
- [ ] El módulo está disponible en la aplicación
