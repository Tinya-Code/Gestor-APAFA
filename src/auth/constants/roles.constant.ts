/**
 * Roles del sistema APAFA.
 *
 * REGLA: El rol 'admin' es exclusivo para desarrolladores.
 * - Tiene acceso TOTAL a todos los endpoints (bypass de RolesGuard).
 * - NUNCA debe aparecer en listados de padres o directiva.
 * - Todas las queries de listado deben excluir: WHERE role != 'admin'
 */
export const ROLES = {
  ADMIN: 'admin', // Super admin (desarrollador)
  ADMIN_COLEGIO: 'admin_colegio', // Administrador del colegio
  PRESIDENTE: 'presidente',
  VICEPRESIDENTE: 'vicepresidente',
  TESORERO: 'tesorero',
  SECRETARIO: 'secretario',
  VOCAL: 'vocal',
  PADRE: 'padre',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Roles que pueden acceder a la directiva (admin del colegio y roles directivos)
 */
export const DIRECTIVA_ROLES: readonly string[] = [
  ROLES.ADMIN_COLEGIO,
  ROLES.PRESIDENTE,
  ROLES.VICEPRESIDENTE,
  ROLES.TESORERO,
  ROLES.SECRETARIO,
  ROLES.VOCAL,
];
