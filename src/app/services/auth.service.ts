import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string>('');
  private userDataSubject = new BehaviorSubject<any>(null);
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.checkToken();
  }

  // Observable para el token JWT
  get token$(): Observable<string> {
    return this.tokenSubject.asObservable();
  }

  // Observable para los datos del usuario
  get userData$(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  // Método para iniciar sesión
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${environment.API_URL}/auth/login`, credentials).pipe(
      map((response: any) => {
        if (response.token) {
          this.handleAuthentication(response.token);
        }
        return response;
      }),
      catchError(error => this.handleError(error))
    );
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next('');
    this.userDataSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  // Verificar y actualizar estado del token
  private checkToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.logout();
      } else {
        this.tokenSubject.next(token);
        const decodedToken = this.jwtHelper.decodeToken(token);
        this.userDataSubject.next(decodedToken);
      }
    }
  }

  // Manejar la autenticación exitosa
  private handleAuthentication(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.userDataSubject.next(decodedToken);
    this.router.navigate(['/home']);
  }

  // Manejar errores
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocurrió un error durante la autenticación';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Credenciales inválidas';
    } else if (error.status === 0) {
      errorMessage = 'Error de conexión con el servidor';
    }

    this.showSnackbar(errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }

  // Mostrar notificación
  private showSnackbar(message: string, panelClass: string = ''): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: [panelClass],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}