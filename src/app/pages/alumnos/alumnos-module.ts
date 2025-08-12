import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlumnosRoutingModule } from './alumnos-routing-module';
import { AlumnosListComponent } from './components/alumnos-dialog/alumnos-list/alumnos-list';
import { AlumnoDialogComponent } from './components/alumnos-dialog/alumnos-dialog/alumnos-dialog';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AlumnosService } from './services/alumnos.service';

@NgModule({
  
  imports: [
    CommonModule,
    AlumnosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    AlumnosListComponent,
    AlumnoDialogComponent
  ],
  providers: [AlumnosService]
})
export class AlumnosModule { }