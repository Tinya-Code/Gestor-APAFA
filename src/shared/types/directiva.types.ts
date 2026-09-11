import type { RowDataPacket } from 'mysql2';

/**
 * Row type for directiva table queries.
 * Used by DirectivaService for DB operations.
 */
export interface DirectivaRow extends RowDataPacket {
  id: number;
  colegio_id: number;
  parent_id: number;
  role: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  // Joined fields from padre table
  parent_name: string;
  parent_surname: string;
  parent_dni: string;
}

/**
 * Entity type for directiva responses.
 * Matches DirectivaRow but without RowDataPacket extension.
 */
export interface DirectivaEntity {
  id: number;
  colegio_id: number;
  parent_id: number;
  role: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  parent_name: string;
  parent_surname: string;
  parent_dni: string;
}
