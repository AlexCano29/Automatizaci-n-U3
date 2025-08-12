import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
// Módulos adicionales requeridos por alumnos-list
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';

const materialModules = [
  // Módulos originales
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatIconModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatToolbarModule,
  // Nuevos módulos agregados
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule
];

@NgModule({
  imports: [...materialModules],
  exports: [...materialModules]
})
export class MaterialModule { }