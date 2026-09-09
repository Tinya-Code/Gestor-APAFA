export interface Directiva {
  id: number;
  parent_id: number;
  role: string;
  start_date: Date;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
