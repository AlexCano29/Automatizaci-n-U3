import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MaterialModule } from './material.module';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { GlobalErrorHandler } from './shared/utils/global-error-handler'; 

// Servicios
import { AuthService } from './services/auth.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

// Interceptores (opcional)
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { LoginComponent } from './pages/auth/login/login.component';

@NgModule({
  declarations: [
    App,
    Header,
    Footer
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Necesario para Angular Material
    HttpClientModule, // Para peticiones HTTP
    AppRoutingModule,
    MaterialModule,
    
  ],
  providers: [
    // Configuración para JWT
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    
    // Servicio de autenticación
    AuthService,
    
    // Interceptores (opcionales pero recomendados)
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    
    // Manejador global de errores
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [App]
})
export class AppModule { }