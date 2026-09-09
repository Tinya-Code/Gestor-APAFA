export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
    name: string;
    surname: string;
    role: string;
    colegio_id: number | null;
    colegio_name: string | null;
    is_super_admin: boolean;
  };
}

export interface PerfilResponse {
  id: number;
  email: string;
  name: string;
  surname: string;
  dni: string | null;
  phone: string | null;
  role: string;
  colegio_id: number | null;
  colegio_name: string | null;
  is_super_admin: boolean;
}

export interface AsignarRolResponse {
  id: number;
  usuario_id: number;
  colegio_id: number;
  role: string;
  updated_at: string;
}

export interface SwitchColegioResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
    name: string;
    surname: string;
    role: string;
    colegio_id: number;
    colegio_name: string;
    is_super_admin: boolean;
  };
}
