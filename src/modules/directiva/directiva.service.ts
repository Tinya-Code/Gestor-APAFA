import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateDirectivaDto } from './dto/create-directiva.dto';
import { UpdateDirectivaDto } from './dto/update-directiva.dto';
import { QueryDirectivaDto } from './dto/query-directiva.dto';
import {
  executePaginatedQuery,
  type PaginatedResult,
} from '../../shared/helpers/pagination.helper';
import type { RowDataPacket } from 'mysql2';

export interface DirectivaRow extends RowDataPacket {
  id: number;
  colegio_id: number;
  parent_id: number;
  role: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  parent_name: string;
  parent_surname: string;
  parent_dni: string;
}

@Injectable()
export class DirectivaService {
  private readonly logger = new Logger(DirectivaService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Listar miembros de la directiva con filtros y paginación.
   */
  async findAll(
    colegioId: number,
    query: QueryDirectivaDto,
  ): Promise<PaginatedResult<DirectivaRow>> {
    const conditions: string[] = ['d.colegio_id = ?', 'd.deleted_at IS NULL'];
    const params: (string | number | boolean)[] = [colegioId];

    // Filtro por rol
    if (query.role) {
      conditions.push('d.role = ?');
      params.push(query.role);
    }

    // Filtro por mandatos vigentes (end_date IS NULL)
    if (query.current === true) {
      conditions.push('d.end_date IS NULL');
    }

    // Filtro por mandatos activos
    if (query.is_active !== undefined) {
      conditions.push('d.is_active = ?');
      params.push(query.is_active ? 1 : 0);
    }

    const where = conditions.join(' AND ');

    const dataQuery = `
      SELECT d.*, p.name as parent_name, p.surname as parent_surname, p.dni as parent_dni
      FROM directiva d
      JOIN padre p ON p.id = d.parent_id AND p.deleted_at IS NULL
      WHERE ${where}
      ORDER BY d.start_date DESC, d.role ASC
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM directiva d
      WHERE ${where}
    `;

    return executePaginatedQuery<DirectivaRow>(
      this.db,
      dataQuery,
      params,
      countQuery,
      params,
      { page: query.page, limit: query.limit },
    );
  }

  /**
   * Obtener un miembro de la directiva por ID.
   */
  async findOne(id: number, colegioId: number): Promise<DirectivaRow> {
    const [rows] = await this.db.query<DirectivaRow[]>(
      `SELECT d.*, p.name as parent_name, p.surname as parent_surname, p.dni as parent_dni
       FROM directiva d
       JOIN padre p ON p.id = d.parent_id AND p.deleted_at IS NULL
       WHERE d.id = ? AND d.colegio_id = ? AND d.deleted_at IS NULL`,
      [id, colegioId],
    );

    if (!rows.length) {
      throw new NotFoundException('Miembro de directiva no encontrado');
    }

    return rows[0];
  }

  /**
   * Asignar un padre a la directiva con un mandato.
   * Valida que no exista un mandato activo duplicado para el mismo rol.
   */
  async create(
    dto: CreateDirectivaDto,
    colegioId: number,
  ): Promise<DirectivaRow> {
    // Verificar que el padre existe y pertenece al colegio
    const [padres] = await this.db.query<RowDataPacket[]>(
      'SELECT id FROM padre WHERE id = ? AND colegio_id = ? AND deleted_at IS NULL',
      [dto.parent_id, colegioId],
    );

    if (!padres.length) {
      throw new NotFoundException('Padre no encontrado en este colegio');
    }

    // Verificar que no exista un mandato activo para el mismo rol
    const [existente] = await this.db.query<RowDataPacket[]>(
      `SELECT id FROM directiva
       WHERE parent_id = ? AND colegio_id = ? AND role = ? AND deleted_at IS NULL AND is_active = 1`,
      [dto.parent_id, colegioId, dto.role],
    );

    if (existente.length) {
      throw new ConflictException(
        `Este padre ya tiene un mandato activo como ${dto.role} en este colegio`,
      );
    }

    // Verificar que no haya otro padre con el mismo rol activo
    const [rolExistente] = await this.db.query<RowDataPacket[]>(
      `SELECT id, parent_id FROM directiva
       WHERE colegio_id = ? AND role = ? AND deleted_at IS NULL AND is_active = 1 AND end_date IS NULL`,
      [colegioId, dto.role],
    );

    if (rolExistente.length) {
      throw new ConflictException(
        `Ya existe un mandato vigente para el rol ${dto.role}. Finalice el mandato actual antes de asignar uno nuevo.`,
      );
    }

    // Validar fechas
    if (dto.end_date && new Date(dto.end_date) <= new Date(dto.start_date)) {
      throw new ConflictException(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }

    // Insertar mandato
    const result: { insertId: number } = await this.db.execute(
      `INSERT INTO directiva (colegio_id, parent_id, role, start_date, end_date, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        colegioId,
        dto.parent_id,
        dto.role,
        dto.start_date,
        dto.end_date ?? null,
        dto.notes ?? null,
      ],
    );

    this.logger.log(
      `Mandato creado: ${dto.role} → padre ${dto.parent_id} en colegio ${colegioId}`,
    );

    return this.findOne(result.insertId, colegioId);
  }

  /**
   * Actualizar un mandato de la directiva.
   */
  async update(
    id: number,
    dto: UpdateDirectivaDto,
    colegioId: number,
  ): Promise<DirectivaRow> {
    // Verificar que el mandato existe
    const mandato = await this.findOne(id, colegioId);

    // Si cambia el padre, verificar que existe en el colegio
    if (dto.parent_id && dto.parent_id !== mandato.parent_id) {
      const [padres] = await this.db.query<RowDataPacket[]>(
        'SELECT id FROM padre WHERE id = ? AND colegio_id = ? AND deleted_at IS NULL',
        [dto.parent_id, colegioId],
      );

      if (!padres.length) {
        throw new NotFoundException('Padre no encontrado en este colegio');
      }
    }

    // Si cambia el rol, verificar que no haya conflicto
    const newRole = dto.role ?? mandato.role;
    const newParentId = dto.parent_id ?? mandato.parent_id;

    if (dto.role || dto.parent_id) {
      const [conflicto] = await this.db.query<RowDataPacket[]>(
        `SELECT id FROM directiva
         WHERE parent_id = ? AND colegio_id = ? AND role = ? AND deleted_at IS NULL AND is_active = 1 AND id != ?`,
        [newParentId, colegioId, newRole, id],
      );

      if (conflicto.length) {
        throw new ConflictException(
          `Ya existe un mandato activo para ${newRole} en este colegio`,
        );
      }
    }

    // Validar fechas
    const newStartDate = dto.start_date ?? mandato.start_date;
    const newEndDate = dto.end_date ?? mandato.end_date;

    if (newEndDate && new Date(newEndDate) <= new Date(newStartDate)) {
      throw new ConflictException(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }

    // Construir SET dinámicamente
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (dto.parent_id !== undefined) {
      updates.push('parent_id = ?');
      values.push(dto.parent_id);
    }
    if (dto.role !== undefined) {
      updates.push('role = ?');
      values.push(dto.role);
    }
    if (dto.start_date !== undefined) {
      updates.push('start_date = ?');
      values.push(dto.start_date);
    }
    if (dto.end_date !== undefined) {
      updates.push('end_date = ?');
      values.push(dto.end_date);
    }
    if (dto.notes !== undefined) {
      updates.push('notes = ?');
      values.push(dto.notes);
    }
    if (dto.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(dto.is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return mandato;
    }

    values.push(id, colegioId);

    await this.db.execute(
      `UPDATE directiva SET ${updates.join(', ')} WHERE id = ? AND colegio_id = ? AND deleted_at IS NULL`,
      values,
    );

    this.logger.log(`Mandato ${id} actualizado en colegio ${colegioId}`);

    return this.findOne(id, colegioId);
  }

  /**
   * Eliminar (soft delete) un mandato de la directiva.
   */
  async remove(id: number, colegioId: number): Promise<{ message: string }> {
    await this.findOne(id, colegioId); // Verificar que existe

    await this.db.execute(
      'UPDATE directiva SET deleted_at = NOW() WHERE id = ? AND colegio_id = ?',
      [id, colegioId],
    );

    this.logger.log(`Mandato ${id} eliminado en colegio ${colegioId}`);

    return { message: 'Mandato eliminado exitosamente' };
  }
}
