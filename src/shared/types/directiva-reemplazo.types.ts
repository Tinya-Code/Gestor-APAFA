import type { RowDataPacket } from 'mysql2';

/**
 * Row type for directiva_reemplazo table queries.
 * Used by ReemplazosService for DB operations.
 */
export interface ReemplazoRow extends RowDataPacket {
  id: number;
  colegio_id: number;
  vocal_parent_id: number;
  replaced_role: string;
  replaced_parent_id: number;
  effective_role: string;
  start_date: string;
  end_date: string | null;
  reason: string | null;
  is_active: number;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  // Joined fields
  vocal_name: string;
  vocal_surname: string;
  replaced_name: string;
  replaced_surname: string;
  created_by_name: string;
  created_by_surname: string;
}

/**
 * Entity type for reemplazo responses.
 * Matches ReemplazoRow but without RowDataPacket extension.
 */
export interface ReemplazoEntity {
  id: number;
  colegio_id: number;
  vocal_parent_id: number;
  replaced_role: string;
  replaced_parent_id: number;
  effective_role: string;
  start_date: string;
  end_date: string | null;
  reason: string | null;
  is_active: number;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  vocal_name: string;
  vocal_surname: string;
  replaced_name: string;
  replaced_surname: string;
  created_by_name: string;
  created_by_surname: string;
}
