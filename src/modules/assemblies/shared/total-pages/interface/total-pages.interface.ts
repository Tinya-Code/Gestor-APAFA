export interface TotalPagesInput {
  colegio_id: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
}

export interface TotalPagesResponse {
  total: number;
  totalPages: number;
}
