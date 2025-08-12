import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Alumno } from '../../../shared/models/alumno.interface';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {
  private apiUrl = `${environment.API_URL}/alumnos`; // Asegúrate que sea /alumnos

  constructor(private http: HttpClient) { }

  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.apiUrl).pipe(
      tap(data => console.log('Datos recibidos:', data))
    );
  }

  createAlumno(alumno: Omit<Alumno, 'id'>): Observable<Alumno> {
    return this.http.post<Alumno>(this.apiUrl, alumno).pipe(
      tap(data => console.log('Alumno creado con ID:', data.id))
    );
  }

  updateAlumno(id: number, alumno: Partial<Alumno>): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.apiUrl}/${id}`, alumno);
  }

  deleteAlumno(id: number): Observable<void> {
    if (!id) {
      return throwError(() => new Error('ID inválido para eliminación'));
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error en deleteAlumno:', error);
        return throwError(() => error);
      })
    );
  }
}