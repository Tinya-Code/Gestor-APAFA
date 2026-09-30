import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import { ListarAsambleasInput } from '../../models/listar-asambleas/listar-asambleas.interface';
import { AsambleaEnLista } from '../../models/listar-asambleas/listar-asambleas.interface';
import { RowDataPacket } from 'mysql2';

@Injectable()
export class ListarAsambleaRepository {
  constructor(private readonly db: DatabaseService) {}

  async listarAsambleas(
    input: ListarAsambleasInput,
  ): Promise<AsambleaEnLista[]> {
    const params: (string | number)[] = [
      input.colegio_id,
      input.limit!,
      input.page!,
    ];

    let query = `
      SELECT 
        a.id, 
        a.title, 
        a.date, 
        a.description, 
        COUNT(d.id) as details_count
      FROM asamblea a
      LEFT JOIN detalle_asamblea d 
        ON d.assembly_id = a.id 
        AND d.deleted_at IS NULL
      WHERE a.colegio_id = ?
        AND a.deleted_at IS NULL
    `;

    if (input.date_from) {
      query += ` AND a.date >= ?`;
      params.push(input.date_from);
    }
    if (input.date_to) {
      query += ` AND a.date <= ?`;
      params.push(input.date_to);
    }

    query += `
      GROUP BY a.id 
      ORDER BY a.date DESC 
      LIMIT ?
      OFFSET ?
    `;

    const offset = (input.page! - 1) * input.limit!;

    params.push(input.limit!, offset);

    const result = await this.db.query<RowDataPacket[]>(query, params);
    return result.map((row) => ({
      id: row.id as number,
      title: row.title as string,
      date: row.date as string,
      description: row.description as string | null,
      details_count: row.details_count as number,
    }));
  }
}
