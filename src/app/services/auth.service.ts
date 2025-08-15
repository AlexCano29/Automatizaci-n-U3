import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/alumnos';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login(credentials: { username: string; password: string }): Observable<boolean> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(alumnos => {
        const usuarioValido = alumnos.find(alumno => 
          alumno.username === credentials.username && 
          alumno.password === credentials.password
        );

        if (usuarioValido) {
          localStorage.setItem('currentUser', JSON.stringify(usuarioValido));
          return true;
        }
        this.snackBar.open('Credenciales incorrectas', 'Cerrar', { duration: 3000 });
        return false;
      }),
      catchError(() => {
        this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 3000 });
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}