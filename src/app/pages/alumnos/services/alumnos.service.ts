import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Alumno } from '../../../shared/models/alumno.interface';
import { AuthService } from '../../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {
  private apiUrl = `${environment.API_URL}/alumnos`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      tap(data => console.log('Alumnos cargados:', data))
    );
  }

  createAlumno(alumno: Omit<Alumno, 'id'>): Observable<Alumno> {
    const alumnoData = {
      ...alumno,
      role: 'alumno',
      activo: true
    };
    return this.http.post<Alumno>(this.apiUrl, alumnoData, { headers: this.getAuthHeaders() }).pipe(
      tap(data => console.log('Alumno creado con ID:', data.id))
    );
  }

  updateAlumno(id: number, alumno: Partial<Alumno>): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.apiUrl}/${id}`, alumno, { headers: this.getAuthHeaders() });
  }

  deleteAlumno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}