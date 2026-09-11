import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extrae el colegio_id del request.
 *
 * - Para usuarios normales: retorna el colegio_id del JWT.
 * - Para super_admin: permite pasar colegio_id como query parameter.
 *   Si no se pasa, retorna null (meaning: ver todos los colegios).
 */
export const ColegioId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario, retornar null
    if (!user) {
      return null;
    }

    // Si el usuario tiene colegio_id en el JWT, usarlo (usuarios normales)
    if (user.colegio_id != null) {
      return user.colegio_id;
    }

    // Si es super_admin y no tiene colegio_id, permitir query parameter
    if (user.is_super_admin) {
      const queryColegioId = request.query?.colegio_id;
      if (queryColegioId) {
        const parsed = parseInt(queryColegioId, 10);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
      // Super_admin sin colegio_id: retornar null (ver todos)
      return null;
    }

    // Para otros usuarios sin colegio_id, retornar null
    return null;
  },
);
