# A1 — Comprender el problema

**Pregunta: ¿Qué problema intenta resolver el sistema?**

---

## Contexto

Las asociaciones de padres de familia (APAFA) administran fondos colectivos provenientes de cuotas, aportes voluntarios y multas por inasistencia a actividades escolares.

Actualmente este proceso se realiza de forma manual, lo que genera:

- Errores en el registro de pagos y gastos
- Pérdida de información histórica
- Falta de transparencia hacia los padres
- Dificultad para generar reportes financieros claros
- Comunicación deficiente entre la directiva y los padres

## Solución

Una plataforma web que digitalice la gestión completa de fondos de la APAFA, permitiendo registrar aportes, multas y gastos, generar reportes automáticos y garantizar transparencia tanto para la directiva como para los padres.

## Restricciones conocidas

- La herramienta debe ser gratuita y sin costos de mantenimiento mensual para la asociación
- Debe funcionar correctamente en dispositivos móviles y de escritorio
- Debe ser escalable para adaptarse a diferentes colegios e instituciones

---
---

# A2 - a - Entidades

## Entidades del dominio

| Entidad | Qué resuelve |
|---|---|
| Padre | Registro de padres de familia vinculados a la institución |
| Estudiante | Registro de alumnos matriculados, asociados a uno o más padres |
| Directiva | Rol que puede asumir un padre (administrador, tesorero) con permisos extendidos |
| Asamblea | Registro de reuniones formales donde se toman decisiones y se presentan balances |
| Evento | Registro de actividades escolares (faenas, reuniones). Generado por una asamblea o de forma independiente |
| Asistencia | Registro de participación de un padre en un evento. Determina si corresponde multa |
| Multa | Cargo generado automáticamente por inasistencia a un evento que la requiere |
| Aporte | Registro de pagos realizados por un padre (cuotas, aportes voluntarios, pago de multas) |
| Comprobante | Documento que respalda un gasto (factura, boleta). Agrupa uno o más items |
| Item de Gasto | Detalle individual de un comprobante con monto y descripción |
| Gasto | Egreso registrado por la directiva, compuesto por items agrupados en un comprobante |
| Movimiento | Registro inmutable de dinero que entró o salió. Base para reportes financieros |
| Notificación | Comunicación generada automáticamente hacia padres por eventos, multas u otros cambios |

---
---