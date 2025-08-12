import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Alumno } from '../../../../../shared/models/alumno.interface';
import { AlumnosService } from '../../../services/alumnos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alumno-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './alumnos-dialog.html'
})
export class AlumnoDialogComponent {
  alumnoForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private alumnosService: AlumnosService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AlumnoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Alumno | null
  ) {
    this.alumnoForm = this.fb.group({
      id: [data?.id || null],
      numero_control: [data?.numero_control || '', Validators.required],
      nombre: [data?.nombre || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      fecha_registro: [data?.fecha_registro || new Date().toISOString().split('T')[0]]
    });

    if (data?.id) {
      this.isEditMode = true;
    }
  }

  onSubmit(): void {
    if (this.alumnoForm.valid) {
      const formData = this.alumnoForm.value;
      const alumnoData: Omit<Alumno, 'id'> = {
        numero_control: formData.numero_control,
        nombre: formData.nombre,
        email: formData.email,
        fecha_registro: formData.fecha_registro
      };

      const operation = this.isEditMode && formData.id ?
        this.alumnosService.updateAlumno(formData.id, alumnoData) :
        this.alumnosService.createAlumno(alumnoData);

      operation.subscribe({
        next: () => {
          this.snackBar.open(`Alumno ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`, 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error:', error);
          this.snackBar.open(`Error: ${error.message}`, 'Cerrar', { duration: 5000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}