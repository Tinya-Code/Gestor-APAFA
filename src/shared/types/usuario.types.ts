import type { RowDataPacket } from 'mysql2';

/**
 * Interfaces compartidas para tablas de usuario y colegio.
 * Usadas en auth, jwt strategy, y services de admin.
 */

export interface UsuarioRow extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  surname: string;
  phone: string | null;
  is_super_admin: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UsuarioColegioRow extends RowDataPacket {
  id: number;
  usuario_id: number;
  colegio_id: number;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  colegio_name: string;
}

export interface ColegioRow extends RowDataPacket {
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
