export interface Alumno {
  id: number;  // Asegúrate que no sea opcional si siempre debe existir
  numero_control: string;
  nombre: string;
  email: string;
  fecha_registro: string | Date;
}