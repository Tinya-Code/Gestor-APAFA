export interface ParentEntity {
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
