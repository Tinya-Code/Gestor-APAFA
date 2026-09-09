import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateParentDto } from './dto/create-parent.dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto/update-parent.dto';
import type { ParentEntity } from './entities/parent.entity/parent.entity';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { executePaginatedQuery } from '../../shared/helpers/pagination.helper';

interface PadreRow extends RowDataPacket {
  id: number;
  colegio_id: number;
  usuario_id: number | null;
  name: string;
  surname: string;
  dni: string;
  phone: string | null;
  email: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

@Injectable()
export class ParentsService {
  private readonly logger = new Logger(ParentsService.name);

  constructor(private readonly db: DatabaseService) {}

  async findAll(
    colegioId: number,
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ data: ParentEntity[]; total: number }> {
    const baseWhere = 'WHERE colegio_id = ? AND deleted_at IS NULL';
    const baseParams: (string | number)[] = [colegioId];

    let searchClause = '';
    const searchParams: string[] = [];

    if (search) {
      searchClause = ' AND (name LIKE ? OR surname LIKE ? OR dni LIKE ?)';
      const searchTerm = `%${search}%`;
      searchParams.push(searchTerm, searchTerm, searchTerm);
    }

    const dataQuery = `
      SELECT id, colegio_id, usuario_id, name, surname, dni, phone, email, created_at, updated_at
      FROM padre
      ${baseWhere}${searchClause}
      ORDER BY surname ASC, name ASC`;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM padre
      ${baseWhere}${searchClause}`;

    const allParams = [...baseParams, ...searchParams];

    return executePaginatedQuery<PadreRow>(
      this.db,
      dataQuery,
      allParams,
      countQuery,
      allParams,
      { page, limit },
    );
  }

  async findOne(id: number, colegioId: number): Promise<ParentEntity> {
    const rows = await this.db.query<PadreRow[]>(
      `SELECT id, colegio_id, usuario_id, name, surname, dni, phone, email, created_at, updated_at
       FROM padre
       WHERE id = ? AND colegio_id = ? AND deleted_at IS NULL`,
      [id, colegioId],
    );

    if (!rows.length) {
      throw new NotFoundException('Padre no encontrado');
    }

    return rows[0];
  }

  async create(dto: CreateParentDto, colegioId: number): Promise<ParentEntity> {
    // Verificar que no exista un padre con el mismo DNI en este colegio
    const existente = await this.db.query<PadreRow[]>(
      'SELECT id FROM padre WHERE dni = ? AND colegio_id = ? AND deleted_at IS NULL',
      [dto.dni, colegioId],
    );

    if (existente.length) {
      throw new ConflictException(
        'Ya existe un padre con este DNI en el colegio',
      );
    }

    const result: ResultSetHeader = await this.db.execute(
      `INSERT INTO padre (colegio_id, usuario_id, name, surname, dni, phone, email)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        colegioId,
        dto.usuario_id ?? null,
        dto.name,
        dto.surname,
        dto.dni,
        dto.phone ?? null,
        dto.email ?? null,
      ],
    );

    const insertId = result.insertId;

    return this.findOne(insertId, colegioId);
  }

  async update(
    id: number,
    dto: UpdateParentDto,
    colegioId: number,
  ): Promise<ParentEntity> {
    // Verificar que el padre existe en este colegio
    const padre = await this.findOne(id, colegioId);

    const updates: string[] = [];
    const params: (string | number | null)[] = [];

    if (dto.name !== undefined) {
      updates.push('name = ?');
      params.push(dto.name);
    }
    if (dto.surname !== undefined) {
      updates.push('surname = ?');
      params.push(dto.surname);
    }
    if (dto.phone !== undefined) {
      updates.push('phone = ?');
      params.push(dto.phone);
    }
    if (dto.email !== undefined) {
      updates.push('email = ?');
      params.push(dto.email);
    }

    if (updates.length === 0) {
      return padre;
    }

    params.push(id, colegioId);

    await this.db.execute(
      `UPDATE padre SET ${updates.join(', ')} WHERE id = ? AND colegio_id = ?`,
      params,
    );

    return this.findOne(id, colegioId);
  }

  async remove(id: number, colegioId: number): Promise<void> {
    // Verificar que el padre existe en este colegio
    await this.findOne(id, colegioId);

    // Verificar que no tenga hijos registrados
    const hijos = await this.db.query<PadreRow[]>(
      'SELECT id FROM estudiante WHERE parent_id = ? AND deleted_at IS NULL',
      [id],
    );

    if (hijos.length) {
      throw new ForbiddenException(
        'No se puede eliminar un padre que tiene hijos registrados',
      );
    }

    await this.db.execute(
      'UPDATE padre SET deleted_at = NOW() WHERE id = ? AND colegio_id = ?',
      [id, colegioId],
    );
  }
}
