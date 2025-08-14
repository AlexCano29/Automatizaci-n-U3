import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthResponse } from '../shared/models/alumno.interface';

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

  get token$(): Observable<string> {
    return this.tokenSubject.asObservable();
  }

  get userData$(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.API_URL}/alumnos`, credentials).pipe(
      map((response: AuthResponse) => {
        if (response.token) {
          this.handleAuthentication(response.token, response.user);
        }
        return response;
      }),
      catchError(error => this.handleError(error))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next('');
    this.userDataSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  isAlumno(): boolean {
    const userData = this.userDataSubject.value;
    return userData?.role === 'alumno';
  }

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

  private handleAuthentication(token: string, user: any): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
    this.userDataSubject.next(user);
    this.router.navigate([user.role === 'admin' ? '/admin' : '/alumno']);
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error durante la autenticación';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Credenciales inválidas';
    } else if (error.status === 403) {
      errorMessage = 'Acceso no autorizado';
    }

    this.showSnackbar(errorMessage, 'error-snackbar');
    return throwError(() => new Error(errorMessage));
  }

  private showSnackbar(message: string, panelClass: string = ''): void {
    this.snackBar.open(message, 'CERRAR', {
      duration: 5000,
      panelClass: [panelClass],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}