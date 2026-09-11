import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateColegioDto } from './dto/create-colegio.dto';
import { UpdateColegioDto } from './dto/update-colegio.dto';
import type { ResultSetHeader } from 'mysql2';
import {
  executePaginatedQuery,
  type PaginatedResult,
} from '../../shared/helpers/pagination.helper';
import type { ColegioRow } from '../../shared/types/usuario.types';

export interface ColegioEntity {
  id: number;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class ColegiosService {
  private readonly logger = new Logger(ColegiosService.name);

  constructor(private readonly db: DatabaseService) {}

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    isActive?: boolean,
  ): Promise<PaginatedResult<ColegioRow>> {
    const baseWhere = 'WHERE deleted_at IS NULL';
    const baseParams: (string | number | boolean)[] = [];

    const conditions: string[] = [];
    const conditionParams: (string | number | boolean)[] = [];

    if (search) {
      conditions.push('(name LIKE ? OR slug LIKE ?)');
      const searchTerm = `%${search}%`;
      conditionParams.push(searchTerm, searchTerm);
    }

    if (isActive !== undefined) {
      conditions.push('is_active = ?');
      conditionParams.push(isActive);
    }

    const extraWhere = conditions.length
      ? ` AND ${conditions.join(' AND ')}`
      : '';
    const allParams = [...baseParams, ...conditionParams];

    const dataQuery = `
      SELECT id, name, slug, address, phone, email, logo_url, is_active, created_at, updated_at
      FROM colegio
      ${baseWhere}${extraWhere}
      ORDER BY name ASC`;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM colegio
      ${baseWhere}${extraWhere}`;

    return executePaginatedQuery<ColegioRow>(
      this.db,
      dataQuery,
      allParams,
      countQuery,
      allParams,
      { page, limit },
    );
  }

  async findOne(id: number): Promise<ColegioRow> {
    const rows = await this.db.query<ColegioRow[]>(
      `SELECT id, name, slug, address, phone, email, logo_url, is_active, created_at, updated_at
       FROM colegio
       WHERE id = ? AND deleted_at IS NULL`,
      [id],
    );

    if (!rows.length) {
      throw new NotFoundException('Colegio no encontrado');
    }

    return rows[0];
  }

  async findBySlug(slug: string): Promise<ColegioRow> {
    const rows = await this.db.query<ColegioRow[]>(
      `SELECT id, name, slug, address, phone, email, logo_url, is_active, created_at, updated_at
       FROM colegio
       WHERE slug = ? AND deleted_at IS NULL`,
      [slug],
    );

    if (!rows.length) {
      throw new NotFoundException('Colegio no encontrado');
    }

    return rows[0];
  }

  async create(dto: CreateColegioDto): Promise<ColegioRow> {
    // Verificar que el slug no exista
    const existente = await this.db.query<ColegioRow[]>(
      'SELECT id FROM colegio WHERE slug = ? AND deleted_at IS NULL',
      [dto.slug],
    );

    if (existente.length) {
      throw new ConflictException('Ya existe un colegio con este slug');
    }

    const result: ResultSetHeader = await this.db.execute(
      `INSERT INTO colegio (name, slug, address, phone, email, logo_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dto.name,
        dto.slug,
        dto.address ?? null,
        dto.phone ?? null,
        dto.email ?? null,
        dto.logo_url ?? null,
      ],
    );

    const insertId = result.insertId;

    return this.findOne(insertId);
  }

  async update(id: number, dto: UpdateColegioDto): Promise<ColegioRow> {
    // Verificar que el colegio existe
    const colegio = await this.findOne(id);

    // Si se cambia el slug, verificar que no exista otro
    if (dto.slug && dto.slug !== colegio.slug) {
      const existente = await this.db.query<ColegioRow[]>(
        'SELECT id FROM colegio WHERE slug = ? AND id != ? AND deleted_at IS NULL',
        [dto.slug, id],
      );

      if (existente.length) {
        throw new ConflictException('Ya existe un colegio con este slug');
      }
    }

    const updates: string[] = [];
    const params: (string | number | boolean | null)[] = [];

    if (dto.name !== undefined) {
      updates.push('name = ?');
      params.push(dto.name);
    }
    if (dto.slug !== undefined) {
      updates.push('slug = ?');
      params.push(dto.slug);
    }
    if (dto.address !== undefined) {
      updates.push('address = ?');
      params.push(dto.address);
    }
    if (dto.phone !== undefined) {
      updates.push('phone = ?');
      params.push(dto.phone);
    }
    if (dto.email !== undefined) {
      updates.push('email = ?');
      params.push(dto.email);
    }
    if (dto.logo_url !== undefined) {
      updates.push('logo_url = ?');
      params.push(dto.logo_url);
    }
    if (dto.is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(dto.is_active);
    }

    if (updates.length === 0) {
      return colegio;
    }

    params.push(id);

    await this.db.execute(
      `UPDATE colegio SET ${updates.join(', ')} WHERE id = ?`,
      params,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    // Verificar que el colegio existe
    await this.findOne(id);

    // Verificar que no tenga usuarios asociados
    const usuarios = await this.db.query<ColegioRow[]>(
      'SELECT id FROM usuario_colegio WHERE colegio_id = ?',
      [id],
    );

    if (usuarios.length) {
      throw new ConflictException(
        'No se puede eliminar un colegio que tiene usuarios asociados',
      );
    }

    // Verificar que no tenga padres registrados
    const padres = await this.db.query<ColegioRow[]>(
      'SELECT id FROM padre WHERE colegio_id = ? AND deleted_at IS NULL',
      [id],
    );

    if (padres.length) {
      throw new ConflictException(
        'No se puede eliminar un colegio que tiene padres registrados',
      );
    }

    // Verificar que no tenga estudiantes registrados
    const estudiantes = await this.db.query<ColegioRow[]>(
      'SELECT id FROM estudiante WHERE colegio_id = ? AND deleted_at IS NULL',
      [id],
    );

    if (estudiantes.length) {
      throw new ConflictException(
        'No se puede eliminar un colegio que tiene estudiantes registrados',
      );
    }

    await this.db.execute(
      'UPDATE colegio SET deleted_at = NOW() WHERE id = ?',
      [id],
    );
  }
}
