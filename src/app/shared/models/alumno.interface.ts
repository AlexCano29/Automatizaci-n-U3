export interface Alumno {
  id: number;
  numero_control: string;
  nombre: string;
  email: string;
  fecha_registro: string | Date;
  username: string;
  password?: string;
  role?: string;
  activo?: boolean;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
    alumnoId?: number;
  };
}