import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateReemplazoDto } from './dto/reemplazos/create-reemplazo.dto';
import { UpdateReemplazoDto } from './dto/reemplazos/update-reemplazo.dto';
import { QueryReemplazoDto } from './dto/reemplazos/query-reemplazo.dto';
import {
  executePaginatedQuery,
  type PaginatedResult,
} from '../../shared/helpers/pagination.helper';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { ReemplazoRow } from '../../shared/types/directiva-reemplazo.types';

export type { ReemplazoRow } from '../../shared/types/directiva-reemplazo.types';

@Injectable()
export class ReemplazosService {
  private readonly logger = new Logger(ReemplazosService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Listar reemplazos con filtros y paginación.
   * Si colegioId es null (super_admin), ver todos los colegios.
   */
  async findAll(
    colegioId: number | null,
    query: QueryReemplazoDto,
  ): Promise<PaginatedResult<ReemplazoRow>> {
    const hasColegioFilter = colegioId != null;
    const conditions: string[] = hasColegioFilter
      ? ['r.colegio_id = ?', 'r.deleted_at IS NULL']
      : ['r.deleted_at IS NULL'];
    const params: (string | number)[] = hasColegioFilter ? [colegioId] : [];

    // Filtro por rol reemplazado
    if (query.replaced_role) {
      conditions.push('r.replaced_role = ?');
      params.push(query.replaced_role);
    }

    // Filtro por vocal
    if (query.vocal_parent_id) {
      conditions.push('r.vocal_parent_id = ?');
      params.push(query.vocal_parent_id);
    }

    // Filtro por activos
    if (query.is_active !== undefined) {
      conditions.push('r.is_active = ?');
      params.push(query.is_active ? 1 : 0);
    }

    // Filtro por vigentes (end_date IS NULL o futuro)
    if (query.current === true) {
      conditions.push('(r.end_date IS NULL OR r.end_date > NOW())');
    }

    const where = conditions.join(' AND ');

    const dataQuery = `
      SELECT r.*,
             pv.name as vocal_name, pv.surname as vocal_surname,
             pr.name as replaced_name, pr.surname as replaced_surname,
             u.name as created_by_name, u.surname as created_by_surname
      FROM directiva_reemplazo r
      JOIN padre pv ON pv.id = r.vocal_parent_id AND pv.deleted_at IS NULL
      JOIN padre pr ON pr.id = r.replaced_parent_id AND pr.deleted_at IS NULL
      JOIN usuario u ON u.id = r.created_by AND u.deleted_at IS NULL
      WHERE ${where}
      ORDER BY r.created_at DESC
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM directiva_reemplazo r
      WHERE ${where}
    `;

    return executePaginatedQuery<ReemplazoRow>(
      this.db,
      dataQuery,
      params,
      countQuery,
      params,
      { page: query.page, limit: query.limit },
    );
  }

  /**
   * Obtener un reemplazo por ID.
   * Si colegioId es null (super_admin), buscar sin filtro de colegio.
   */
  async findOne(id: number, colegioId: number | null): Promise<ReemplazoRow> {
    const hasColegioFilter = colegioId != null;
    const query = hasColegioFilter
      ? `SELECT r.*,
              pv.name as vocal_name, pv.surname as vocal_surname,
              pr.name as replaced_name, pr.surname as replaced_surname,
              u.name as created_by_name, u.surname as created_by_surname
         FROM directiva_reemplazo r
         JOIN padre pv ON pv.id = r.vocal_parent_id AND pv.deleted_at IS NULL
         JOIN padre pr ON pr.id = r.replaced_parent_id AND pr.deleted_at IS NULL
         JOIN usuario u ON u.id = r.created_by AND u.deleted_at IS NULL
         WHERE r.id = ? AND r.colegio_id = ? AND r.deleted_at IS NULL`
      : `SELECT r.*,
              pv.name as vocal_name, pv.surname as vocal_surname,
              pr.name as replaced_name, pr.surname as replaced_surname,
              u.name as created_by_name, u.surname as created_by_surname
         FROM directiva_reemplazo r
         JOIN padre pv ON pv.id = r.vocal_parent_id AND pv.deleted_at IS NULL
         JOIN padre pr ON pr.id = r.replaced_parent_id AND pr.deleted_at IS NULL
         JOIN usuario u ON u.id = r.created_by AND u.deleted_at IS NULL
         WHERE r.id = ? AND r.deleted_at IS NULL`;
    const params = hasColegioFilter ? [id, colegioId] : [id];

    const rows = await this.db.query<ReemplazoRow[]>(query, params);

    if (!rows.length) {
      throw new NotFoundException('Reemplazo no encontrado');
    }

    return rows[0];
  }

  /**
   * Crear un reemplazo temporal.
   * Solo presidente o admin_colegio pueden autorizar reemplazos.
   * Usa transacción para evitar race conditions.
   */
  async create(
    dto: CreateReemplazoDto,
    colegioId: number,
    createdById: number,
  ): Promise<ReemplazoRow> {
    const connection = await this.db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Verificar que el vocal existe y es vocal en el colegio (con lock)
      const [vocales] = await connection.query<ReemplazoRow[]>(
        `SELECT d.id, d.parent_id, d.role
         FROM directiva d
         WHERE d.parent_id = ? AND d.colegio_id = ? AND d.role = 'vocal'
         AND d.deleted_at IS NULL AND d.is_active = 1
         FOR UPDATE`,
        [dto.vocal_parent_id, colegioId],
      );

      if (!vocales.length) {
        throw new NotFoundException(
          'El padre indicado no es vocal activo en este colegio',
        );
      }

      // 2. Verificar que el directivo a reemplazar existe y tiene el rol indicado (con lock)
      const [directivos] = await connection.query<ReemplazoRow[]>(
        `SELECT d.id, d.parent_id, d.role
         FROM directiva d
         WHERE d.parent_id = ? AND d.colegio_id = ? AND d.role = ?
         AND d.deleted_at IS NULL AND d.is_active = 1
         FOR UPDATE`,
        [dto.replaced_parent_id, colegioId, dto.replaced_role],
      );

      if (!directivos.length) {
        throw new NotFoundException(
          `No se encontró un directivo activo con rol ${dto.replaced_role} para reemplazar`,
        );
      }

      // 3. Verificar que no sea el mismo padre
      if (dto.vocal_parent_id === dto.replaced_parent_id) {
        throw new ConflictException(
          'El vocal no puede reemplazarse a sí mismo',
        );
      }

      // 4. Verificar que no haya un reemplazo activo para el mismo rol (con lock)
      const [existente] = await connection.query<ReemplazoRow[]>(
        `SELECT id FROM directiva_reemplazo
         WHERE replaced_role = ? AND colegio_id = ? AND is_active = 1
         AND (end_date IS NULL OR end_date > NOW())
         AND deleted_at IS NULL
         FOR UPDATE`,
        [dto.replaced_role, colegioId],
      );

      if (existente.length) {
        throw new ConflictException(
          `Ya existe un reemplazo activo para el rol ${dto.replaced_role}. Finalice el reemplazo actual antes de crear uno nuevo.`,
        );
      }

      // 5. Verificar que el vocal no tenga ya un reemplazo activo (con lock)
      const [vocalActivo] = await connection.query<ReemplazoRow[]>(
        `SELECT id FROM directiva_reemplazo
         WHERE vocal_parent_id = ? AND colegio_id = ? AND is_active = 1
         AND (end_date IS NULL OR end_date > NOW())
         AND deleted_at IS NULL
         FOR UPDATE`,
        [dto.vocal_parent_id, colegioId],
      );

      if (vocalActivo.length) {
        throw new ConflictException(
          'Este vocal ya tiene un reemplazo activo. Un vocal solo puede reemplazar a un directivo a la vez.',
        );
      }

      // 6. Validar fechas
      if (dto.end_date && new Date(dto.end_date) <= new Date(dto.start_date)) {
        throw new ConflictException(
          'La fecha de fin debe ser posterior a la fecha de inicio',
        );
      }

      // 7. Insertar reemplazo
      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO directiva_reemplazo
         (colegio_id, vocal_parent_id, replaced_role, replaced_parent_id,
          effective_role, start_date, end_date, reason, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          colegioId,
          dto.vocal_parent_id,
          dto.replaced_role,
          dto.replaced_parent_id,
          dto.replaced_role, // effective_role = replaced_role
          dto.start_date,
          dto.end_date ?? null,
          dto.reason ?? null,
          createdById,
        ],
      );

      await connection.commit();

      this.logger.log(
        `Reemplazo creado: vocal ${dto.vocal_parent_id} reemplaza a ${dto.replaced_role} en colegio ${colegioId} por usuario ${createdById}`,
      );

      return this.findOne(result.insertId, colegioId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Actualizar un reemplazo (extender fecha, cambiar motivo, desactivar).
   */
  async update(
    id: number,
    dto: UpdateReemplazoDto,
    colegioId: number,
    updatedById: number,
  ): Promise<ReemplazoRow> {
    const reemplazo = await this.findOne(id, colegioId);

    // Si se intenta desactivar, verificar que esté activo
    if (dto.is_active === false && !reemplazo.is_active) {
      throw new ConflictException('El reemplazo ya está inactivo');
    }

    // Validar fechas
    const newEndDate = dto.end_date ?? reemplazo.end_date;
    if (newEndDate && new Date(newEndDate) <= new Date(reemplazo.start_date)) {
      throw new ConflictException(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }

    // Construir SET dinámicamente
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (dto.end_date !== undefined) {
      updates.push('end_date = ?');
      values.push(dto.end_date);
    }
    if (dto.reason !== undefined) {
      updates.push('reason = ?');
      values.push(dto.reason);
    }
    if (dto.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(dto.is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return reemplazo;
    }

    values.push(id, colegioId);

    await this.db.execute(
      `UPDATE directiva_reemplazo SET ${updates.join(', ')}
       WHERE id = ? AND colegio_id = ? AND deleted_at IS NULL`,
      values,
    );

    this.logger.log(
      `Reemplazo ${id} actualizado en colegio ${colegioId} por usuario ${updatedById}. ` +
        `Cambios: ${Object.keys(dto)
          .filter((k) => dto[k as keyof typeof dto] !== undefined)
          .join(', ')}`,
    );

    return this.findOne(id, colegioId);
  }

  /**
   * Finalizar un reemplazo (soft delete + desactivar).
   */
  async remove(
    id: number,
    colegioId: number,
    deletedById: number,
  ): Promise<{ message: string }> {
    const reemplazo = await this.findOne(id, colegioId); // Verificar que existe

    await this.db.execute(
      `UPDATE directiva_reemplazo
       SET deleted_at = NOW(), is_active = 0
       WHERE id = ? AND colegio_id = ?`,
      [id, colegioId],
    );

    this.logger.log(
      `Reemplazo ${id} finalizado en colegio ${colegioId} por usuario ${deletedById}. ` +
        `Vocal: ${reemplazo.vocal_parent_id}, Rol reemplazado: ${reemplazo.replaced_role}`,
    );

    return { message: 'Reemplazo finalizado exitosamente' };
  }

  /**
   * Obtener el effective_role de un vocal en un colegio.
   * Usado por JWT strategy y RolesGuard.
   * Retorna null si no tiene reemplazo activo.
   */
  async getEffectiveRole(
    vocalParentId: number,
    colegioId: number,
  ): Promise<string | null> {
    const rows = await this.db.query<RowDataPacket[]>(
      `SELECT effective_role
       FROM directiva_reemplazo
       WHERE vocal_parent_id = ? AND colegio_id = ? AND is_active = 1
       AND (end_date IS NULL OR end_date > NOW())
       AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT 1`,
      [vocalParentId, colegioId],
    );

    return rows.length > 0 ? (rows[0].effective_role as string) : null;
  }
}
