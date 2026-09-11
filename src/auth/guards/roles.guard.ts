import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { DatabaseService } from '../../database/database.service';

/**
 * Cache simple en memoria para roles efectivos de vocales.
 * Evita queries N+1 al RolesGuard en cada request.
 * TTL: 30 segundos (balance entre performance y frescura de datos).
 */
interface CacheEntry {
  effectiveRole: string;
  expiresAt: number;
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly effectiveRoleCache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL_MS = 30_000; // 30 segundos

  constructor(
    private readonly reflector: Reflector,
    private readonly db: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Super admin bypass: tiene acceso total
    if (user?.is_super_admin === true) {
      return true;
    }

    // Admin bypass: el rol 'admin_colegio' tiene acceso total al colegio
    if (user?.role === 'admin_colegio') {
      return true;
    }

    // Determinar el rol efectivo del usuario
    let effectiveRole = user?.role;

    // Si es vocal, verificar si tiene un reemplazo activo (con cache)
    if (user?.role === 'vocal' && user?.id && user?.colegio_id) {
      const cacheKey = `${user.id}:${user.colegio_id}`;
      const cached = this.effectiveRoleCache.get(cacheKey);

      if (cached && cached.expiresAt > Date.now()) {
        effectiveRole = cached.effectiveRole;
      } else {
        // Query optimizada: un solo JOIN en lugar de subquery
        const reemplazos = await this.db.query(
          `SELECT dr.effective_role
           FROM directiva_reemplazo dr
           INNER JOIN padre p ON p.id = dr.vocal_parent_id AND p.deleted_at IS NULL
           WHERE p.usuario_id = ?
             AND dr.colegio_id = ?
             AND dr.is_active = 1
             AND (dr.end_date IS NULL OR dr.end_date > NOW())
             AND dr.deleted_at IS NULL
           ORDER BY dr.created_at DESC
           LIMIT 1`,
          [user.id, user.colegio_id],
        );

        if (reemplazos.length > 0) {
          effectiveRole = reemplazos[0].effective_role;
        }

        // Guardar en cache
        this.effectiveRoleCache.set(cacheKey, {
          effectiveRole: effectiveRole ?? user?.role ?? '',
          expiresAt: Date.now() + this.CACHE_TTL_MS,
        });
      }
    }

    // Guardar el rol efectivo en el request para uso posterior
    request.user = {
      ...user,
      effective_role: effectiveRole,
    };

    if (!user || !requiredRoles.includes(effectiveRole)) {
      throw new ForbiddenException('Permisos insuficientes');
    }

    return true;
  }

  /**
   * Invalidar cache cuando se crea/actualiza/elimina un reemplazo.
   * Llamar desde ReemplazosService después de una operación de escritura.
   */
  invalidateCache(vocalUserId: number, colegioId: number): void {
    const cacheKey = `${vocalUserId}:${colegioId}`;
    this.effectiveRoleCache.delete(cacheKey);
  }
}
