import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'home', 
    loadChildren: () => import('./pages/home/home-module').then(m => m.HomeModule) 
  },
  { 
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth-module').then(m => m.AuthModule)
  },
  { 
    path: 'login', 
    loadChildren: () => import('./pages/auth/login/login-module').then(m => m.LoginModule) 
  },
  { path: 'alumnos', loadChildren: () => import('./pages/alumnos/alumnos-module').then(m => m.AlumnosModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }