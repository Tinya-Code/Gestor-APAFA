import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../../database/database.service';
import { RowDataPacket } from 'mysql2';

@Injectable()
export class TotalPagesRepository {
  constructor(private readonly db: DatabaseService) {}

  async getTotalPages(
    colegio_id: number,
    limit: number = 10, // limite default de 10
    date_from?: string,
    date_to?: string,
  ): Promise<number> {
    const params: (string | number)[] = [colegio_id];

    let query = `
      SELECT COUNT(*) as total
      FROM asamblea a
      WHERE a.colegio_id = ? AND a.deleted_at IS NULL
    `;

    if (date_from) {
      query += ` AND a.date >= ?`;
      params.push(date_from);
    }
    if (date_to) {
      query += ` AND a.date <= ?`;
      params.push(date_to);
    }

    const result = await this.db.query<RowDataPacket[]>(query, params);
    const total = (result[0]?.total as number) || 0;
    return Math.ceil(total / limit);
  }
}
