
# A3 — Actores y permisos

**Pregunta: ¿Quién interactúa con el sistema y qué puede hacer?**

---

| Actor          | Descripción                                                                                   | Límite                                                            |
| -------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Super Admin    | Desarrollador con `is_super_admin=true`. Accede a TODOS los colegios.                         | Acceso total al sistema. Bypass de RolesGuard. NUNCA aparece en listados. |
| Presidente     | Padre de familia con rol de Presidente                                                        | Acceso completo (excepto panel de tesorero)                       |
| Vicepresidente | Padre de familia con rol de Vicepresidente                                                    | Acceso completo (excepto panel de tesorero)                       |
| Tesorero       | Padre con rol de tesorero en la directiva                                                     | Acceso a operaciones financieras                                  |
| Secretaria/o   | Padre con rol de Secretaria/o                                                                 | Toma de notas y asistencia en Eventos. Registra detalles de asambleas. |
| Vocal          | Padre de familia con rol de vocal (apoyo) que puede reemplazar temporalmente a otro miembro de la directiva | Acceso parcial (solo lectura) + permisos del rol reemplazado durante el reemplazo |
| Padre          | Padre sin rol en directiva                                                                    | Acceso a la pagina web de avisos                                  |
| Sistema        | Proceso automático sin intervención humana                                                    | Ejecuta multas, notificaciones y reportes automáticos             |

---

## Reemplazos Temporales de Directiva

El rol **Vocal** puede reemplazar temporalmente a otro miembro de la directiva cuando estos están ausentes. Este mecanismo:

- Solo puede ser autorizado por el **Presidente** o **Super Admin**
- Otorga al vocal los permisos del rol que reemplaza (ej: si reemplaza al tesorero, puede operar Finanzas)
- Es temporal: tiene fecha de inicio y fin (o indefinido hasta que se cancele)
- Un vocal solo puede tener un reemplazo activo a la vez
- Un rol solo puede tener un reemplazo activo a la vez

### Ejemplo de uso

```
1. Tesorero se toma licencia médica
2. Presidente autoriza al vocal Carlos como reemplazante
   POST /api/v1/directiva/reemplazos
   { vocal_parent_id: 3, replaced_role: 'tesorero', replaced_parent_id: 2 }

3. Carlos ahora tiene effective_role = 'tesorero' → acceso a operaciones financieras

4. Tesorero regresa → Presidente finaliza el reemplazo
   DELETE /api/v1/directiva/reemplazos/:id
   Carlos vuelve a solo lectura
```

---
