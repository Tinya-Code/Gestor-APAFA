export interface StudentEntity {
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
