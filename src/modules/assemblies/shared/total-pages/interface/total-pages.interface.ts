export interface TotalPagesInput {
  colegio_id: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
}

export interface TotalPagesResponse {
  totalPages: number;
}
