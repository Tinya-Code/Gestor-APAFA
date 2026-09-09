import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import type {
  UsuarioRow,
  UsuarioColegioRow,
} from '../../shared/types/usuario.types';
import { executePaginatedQuery } from '../../shared/helpers/pagination.helper';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface UsuarioEntity {
  id: number;
  email: string;
  name: string;
  surname: string;
  phone: string | null;
  is_super_admin: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UsuarioColegioEntity {
  id: number;
  usuario_id: number;
  colegio_id: number;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  colegio_name: string;
}

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(private readonly db: DatabaseService) {}

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ data: UsuarioEntity[]; total: number }> {
    const baseWhere = 'WHERE deleted_at IS NULL';
    const baseParams: (string | number)[] = [];

    let searchClause = '';
    const searchParams: string[] = [];

    if (search) {
      searchClause = ' AND (name LIKE ? OR surname LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      searchParams.push(searchTerm, searchTerm, searchTerm);
    }

    const dataQuery = `
      SELECT id, email, name, surname, phone, is_super_admin, created_at, updated_at
      FROM usuario
      ${baseWhere}${searchClause}
      ORDER BY surname ASC, name ASC`;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM usuario
      ${baseWhere}${searchClause}`;

    const allParams = [...baseParams, ...searchParams];

    return executePaginatedQuery<UsuarioRow>(
      this.db,
      dataQuery,
      allParams,
      countQuery,
      allParams,
      { page, limit },
    );
  }

  async findOne(id: number): Promise<UsuarioEntity> {
    const rows = await this.db.query<UsuarioRow[]>(
      `SELECT id, email, name, surname, phone, is_super_admin, created_at, updated_at
       FROM usuario
       WHERE id = ? AND deleted_at IS NULL`,
      [id],
    );

    if (!rows.length) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return rows[0];
  }

  async findColegios(usuarioId: number): Promise<UsuarioColegioEntity[]> {
    // Verificar que el usuario existe
    await this.findOne(usuarioId);

    const rows = await this.db.query<UsuarioColegioRow[]>(
      `SELECT uc.id, uc.usuario_id, uc.colegio_id, uc.role, uc.is_active, uc.created_at, uc.updated_at,
              c.name as colegio_name
       FROM usuario_colegio uc
       JOIN colegio c ON c.id = uc.colegio_id
       WHERE uc.usuario_id = ?
       ORDER BY c.name ASC`,
      [usuarioId],
    );

    return rows;
  }

  async assignColegio(
    usuarioId: number,
    colegioId: number,
    role: string,
  ): Promise<UsuarioColegioEntity> {
    // Verificar que el usuario existe
    await this.findOne(usuarioId);

    // Verificar que el colegio existe
    const colegios = await this.db.query<RowDataPacket[]>(
      'SELECT id FROM colegio WHERE id = ? AND deleted_at IS NULL',
      [colegioId],
    );

    if (!colegios.length) {
      throw new NotFoundException('Colegio no encontrado');
    }

    // Verificar si ya existe la relación
    const existente = await this.db.query<UsuarioColegioRow[]>(
      'SELECT id FROM usuario_colegio WHERE usuario_id = ? AND colegio_id = ?',
      [usuarioId, colegioId],
    );

    if (existente.length) {
      // Actualizar rol existente
      await this.db.execute(
        'UPDATE usuario_colegio SET role = ?, updated_at = NOW() WHERE usuario_id = ? AND colegio_id = ?',
        [role, usuarioId, colegioId],
      );

      const rows = await this.db.query<UsuarioColegioRow[]>(
        `SELECT uc.id, uc.usuario_id, uc.colegio_id, uc.role, uc.is_active, uc.created_at, uc.updated_at,
                c.name as colegio_name
         FROM usuario_colegio uc
         JOIN colegio c ON c.id = uc.colegio_id
         WHERE uc.usuario_id = ? AND uc.colegio_id = ?`,
        [usuarioId, colegioId],
      );

      return rows[0];
    } else {
      // Crear nueva relación
      const result: ResultSetHeader = await this.db.execute(
        'INSERT INTO usuario_colegio (usuario_id, colegio_id, role) VALUES (?, ?, ?)',
        [usuarioId, colegioId, role],
      );

      const rows = await this.db.query<UsuarioColegioRow[]>(
        `SELECT uc.id, uc.usuario_id, uc.colegio_id, uc.role, uc.is_active, uc.created_at, uc.updated_at,
                c.name as colegio_name
         FROM usuario_colegio uc
         JOIN colegio c ON c.id = uc.colegio_id
         WHERE uc.id = ?`,
        [result.insertId],
      );

      return rows[0];
    }
  }

  async removeColegio(usuarioId: number, colegioId: number): Promise<void> {
    // Verificar que la relación existe
    const existente = await this.db.query<UsuarioColegioRow[]>(
      'SELECT id FROM usuario_colegio WHERE usuario_id = ? AND colegio_id = ?',
      [usuarioId, colegioId],
    );

    if (!existente.length) {
      throw new NotFoundException('El usuario no pertenece a este colegio');
    }

    await this.db.execute(
      'DELETE FROM usuario_colegio WHERE usuario_id = ? AND colegio_id = ?',
      [usuarioId, colegioId],
    );
  }

  async remove(id: number): Promise<void> {
    // Verificar que el usuario existe y no es super admin
    const usuario = await this.findOne(id);
    if (usuario.is_super_admin) {
      throw new ConflictException('No se puede eliminar al super admin');
    }

    // Verificar que no tenga padres asociados
    const padres = await this.db.query<RowDataPacket[]>(
      'SELECT id FROM padre WHERE usuario_id = ? AND deleted_at IS NULL',
      [id],
    );

    if (padres.length) {
      throw new ConflictException(
        'No se puede eliminar un usuario que tiene padres asociados',
      );
    }

    // Soft delete
    await this.db.execute(
      'UPDATE usuario SET deleted_at = NOW() WHERE id = ?',
      [id],
    );

    // Hard delete: usuario_colegio NO tiene deleted_at (tabla relacional con FK CASCADE)
    // Al eliminar el usuario, las relaciones se eliminan físicamente
    await this.db.execute('DELETE FROM usuario_colegio WHERE usuario_id = ?', [
      id,
    ]);
  }
}
