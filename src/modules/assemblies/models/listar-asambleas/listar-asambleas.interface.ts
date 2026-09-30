export interface ListarAsambleasInput {
  colegio_id: number;
  page?: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
}
export interface AsambleaEnLista {
  id: number;
  title: string;
  date: string;
  description: string | null;
  details_count: number;
}

export interface PaginacionMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ListarAsambleasResponse {
  data: AsambleaEnLista[];
  pagination: PaginacionMeta;
}
