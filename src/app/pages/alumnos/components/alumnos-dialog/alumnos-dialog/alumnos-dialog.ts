import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alumno } from '../../../../../shared/models/alumno.interface';
import { AlumnosService } from '../../../services/alumnos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-alumno-dialog',
  templateUrl: './alumnos-dialog.html',
  styleUrls: ['./alumnos-dialog.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class AlumnoDialogComponent implements OnInit {
  alumnoForm: FormGroup;
  isEditMode: boolean = false;
  hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private alumnosService: AlumnosService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AlumnoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Alumno | null
  ) {
    this.alumnoForm = this.fb.group({
      numero_control: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fecha_registro: [new Date()],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      activo: [true]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.alumnoForm.patchValue({
        ...this.data,
        password: ''
      });
      this.alumnoForm.get('password')?.clearValidators();
      this.alumnoForm.get('password')?.updateValueAndValidity();
    }
  }

  generateCredentials(): void {
    const nombre = this.alumnoForm.get('nombre')?.value;
    if (nombre) {
      const username = this.generateUsername(nombre);
      const password = this.generateRandomPassword();
      
      this.alumnoForm.patchValue({
        username: username,
        password: password
      });
    }
  }

  private generateUsername(nombreCompleto: string): string {
    const [nombre, apellido] = nombreCompleto.toLowerCase().split(' ');
    return (nombre[0] + (apellido || '')).toLowerCase();
  }

  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  onSubmit(): void {
    if (this.alumnoForm.valid) {
      const alumnoData = this.alumnoForm.value;
      
      if (this.isEditMode && this.data?.id) {
        this.alumnosService.updateAlumno(this.data.id, alumnoData).subscribe({
          next: () => {
            this.snackBar.open('Alumno actualizado', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        this.alumnosService.createAlumno(alumnoData).subscribe({
          next: () => {
            this.snackBar.open('Alumno creado', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open('Error al crear', 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}