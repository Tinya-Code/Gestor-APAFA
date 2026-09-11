import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateStudentDto } from './dto/create-student.dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto/update-student.dto';
import type { StudentEntity } from './entities/student.entity/student.entity';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { executePaginatedQuery } from '../../shared/helpers/pagination.helper';

interface EstudianteRow extends RowDataPacket {
  id: number;
  colegio_id: number;
  name: string;
  surname: string;
  grade: string;
  section: string | null;
  parent_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(private readonly db: DatabaseService) {}

  async findAll(
    colegioId: number | null,
    page = 1,
    limit = 10,
    search?: string,
    grade?: string,
  ): Promise<{
    data: StudentEntity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  }> {
    // Si colegioId es null (super_admin sin colegio), ver todos los colegios
    const hasColegioFilter = colegioId != null;
    const baseWhere = hasColegioFilter
      ? 'WHERE colegio_id = ? AND deleted_at IS NULL'
      : 'WHERE deleted_at IS NULL';
    const baseParams: (string | number | boolean)[] = hasColegioFilter
      ? [colegioId]
      : [];

    const conditions: string[] = [];
    const conditionParams: (string | number | boolean)[] = [];

    if (search) {
      conditions.push('(name LIKE ? OR surname LIKE ?)');
      const searchTerm = `%${search}%`;
      conditionParams.push(searchTerm, searchTerm);
    }

    if (grade) {
      conditions.push('grade = ?');
      conditionParams.push(grade);
    }

    const extraWhere = conditions.length
      ? ` AND ${conditions.join(' AND ')}`
      : '';
    const allParams = [...baseParams, ...conditionParams];

    const dataQuery = `
      SELECT id, colegio_id, name, surname, grade, section, parent_id, created_at, updated_at
      FROM estudiante
      ${baseWhere}${extraWhere}
      ORDER BY surname ASC, name ASC`;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM estudiante
      ${baseWhere}${extraWhere}`;

    return executePaginatedQuery<EstudianteRow>(
      this.db,
      dataQuery,
      allParams,
      countQuery,
      allParams,
      { page, limit },
    );
  }

  async findOne(id: number, colegioId: number | null): Promise<StudentEntity> {
    // Si colegioId es null (super_admin), buscar sin filtro de colegio
    const hasColegioFilter = colegioId != null;
    const query = hasColegioFilter
      ? `SELECT id, colegio_id, name, surname, grade, section, parent_id, created_at, updated_at
         FROM estudiante
         WHERE id = ? AND colegio_id = ? AND deleted_at IS NULL`
      : `SELECT id, colegio_id, name, surname, grade, section, parent_id, created_at, updated_at
         FROM estudiante
         WHERE id = ? AND deleted_at IS NULL`;
    const params = hasColegioFilter ? [id, colegioId] : [id];

    const rows = await this.db.query<EstudianteRow[]>(query, params);

    if (!rows.length) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return rows[0];
  }

  async create(
    dto: CreateStudentDto,
    colegioId: number,
  ): Promise<StudentEntity> {
    // Verificar que el padre existe en este colegio
    const padres = await this.db.query<RowDataPacket[]>(
      'SELECT id FROM padre WHERE id = ? AND colegio_id = ? AND deleted_at IS NULL',
      [dto.parent_id, colegioId],
    );

    if (!padres.length) {
      throw new NotFoundException('Padre no encontrado en este colegio');
    }

    const result: ResultSetHeader = await this.db.execute(
      `INSERT INTO estudiante (colegio_id, name, surname, grade, section, parent_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        colegioId,
        dto.name,
        dto.surname,
        dto.grade,
        dto.section ?? null,
        dto.parent_id,
      ],
    );

    const insertId = result.insertId;

    return this.findOne(insertId, colegioId);
  }

  async update(
    id: number,
    dto: UpdateStudentDto,
    colegioId: number,
  ): Promise<StudentEntity> {
    // Verificar que el estudiante existe en este colegio
    const estudiante = await this.findOne(id, colegioId);

    // Si se cambia el padre, verificar que exista en este colegio
    if (dto.parent_id && dto.parent_id !== estudiante.parent_id) {
      const padres = await this.db.query<RowDataPacket[]>(
        'SELECT id FROM padre WHERE id = ? AND colegio_id = ? AND deleted_at IS NULL',
        [dto.parent_id, colegioId],
      );

      if (!padres.length) {
        throw new NotFoundException('Padre no encontrado en este colegio');
      }
    }

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
    if (dto.grade !== undefined) {
      updates.push('grade = ?');
      params.push(dto.grade);
    }
    if (dto.section !== undefined) {
      updates.push('section = ?');
      params.push(dto.section);
    }
    if (dto.parent_id !== undefined) {
      updates.push('parent_id = ?');
      params.push(dto.parent_id);
    }

    if (updates.length === 0) {
      return estudiante;
    }

    params.push(id, colegioId);

    await this.db.execute(
      `UPDATE estudiante SET ${updates.join(', ')} WHERE id = ? AND colegio_id = ?`,
      params,
    );

    return this.findOne(id, colegioId);
  }

  async remove(id: number, colegioId: number): Promise<void> {
    // Verificar que el estudiante existe en este colegio
    await this.findOne(id, colegioId);

    // Verificar que no tenga asistencias registradas
    const asistencias = await this.db.query<RowDataPacket[]>(
      'SELECT id FROM asistencia WHERE estudiante_id = ? AND deleted_at IS NULL',
      [id],
    );

    if (asistencias.length) {
      throw new ForbiddenException(
        'No se puede eliminar un estudiante que tiene asistencias registradas',
      );
    }

    await this.db.execute(
      'UPDATE estudiante SET deleted_at = NOW() WHERE id = ? AND colegio_id = ?',
      [id, colegioId],
    );
  }
}
