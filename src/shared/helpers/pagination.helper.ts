import type { RowDataPacket } from 'mysql2';
import { DatabaseService } from '../../database/database.service';

/**
 * Información de paginación (formato A8).
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

/**
 * Resultado paginado genérico (formato A8).
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Opciones de paginación.
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  maxLimit?: number;
}

/**
 * Calcula offset y limit seguros para queries paginadas.
 *
 * @param options - Opciones de paginación (page, limit, maxLimit)
 * @returns Objeto con offset, limit seguro, y parámetros para COUNT query
 */
export function calculatePagination(options: PaginationOptions = {}) {
  const maxLimit = options.maxLimit ?? 100;
  const page = Math.max(options.page ?? 1, 1);
  const limit = Math.min(Math.max(options.limit ?? 10, 1), maxLimit);
  const offset = (page - 1) * limit;

  return { offset, limit, page };
}

/**
 * Ejecuta una query paginada con COUNT paralelo.
 *
 * @param db - DatabaseService inyectado
 * @param dataQuery - Query SELECT con placeholders para LIMIT y OFFSET
 * @param dataParams - Parámetros de la data query (sin LIMIT/OFFSET)
 * @param countQuery - Query COUNT(*) con los mismos filtros
 * @param countParams - Parámetros de la count query
 * @param options - Opciones de paginación
 * @returns PaginatedResult con data y pagination (formato A8)
 */
export async function executePaginatedQuery<T extends RowDataPacket>(
  db: DatabaseService,
  dataQuery: string,
  dataParams: (string | number | boolean)[],
  countQuery: string,
  countParams: (string | number | boolean)[],
  options: PaginationOptions = {},
): Promise<PaginatedResult<T>> {
  const { offset, limit, page } = calculatePagination(options);

  // Agregar LIMIT y OFFSET a la data query
  const fullDataQuery = `${dataQuery} LIMIT ? OFFSET ?`;
  const fullDataParams = [...dataParams, limit, offset];

  // Ejecutar ambas queries en paralelo
  const [rows, countResult] = await Promise.all([
    db.query<T[]>(fullDataQuery, fullDataParams),
    db.query<RowDataPacket[]>(countQuery, countParams),
  ]);

  const total = (countResult[0] as { total?: number })?.total ?? 0;
  const total_pages = Math.ceil(total / limit);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total,
      total_pages,
    },
  };
}
