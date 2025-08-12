import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Alumno } from '../../../../../shared/models/alumno.interface';
import { AlumnosService } from '../../../services/alumnos.service';
import { AlumnoDialogComponent } from '../alumnos-dialog/alumnos-dialog';

@Component({
  selector: 'app-alumnos-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule
  ],
  templateUrl: './alumnos-list.html',
  styleUrls: ['./alumnos-list.scss']
})
export class AlumnosListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['numero_control', 'nombre', 'email', 'fecha_registro', 'actions'];
  dataSource = new MatTableDataSource<Alumno>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private alumnosService: AlumnosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAlumnos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAlumnos(): void {
    this.alumnosService.getAlumnos().subscribe({
      next: (alumnos: Alumno[]) => {
        console.log('Alumnos cargados:', alumnos); // Verifica IDs
        this.dataSource.data = alumnos;
      },
      error: (error) => {
        console.error('Error al cargar alumnos:', error);
        this.snackBar.open('Error al cargar alumnos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(alumno?: Alumno): void {
    const dialogRef = this.dialog.open(AlumnoDialogComponent, {
      width: '500px',
      data: alumno || null
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadAlumnos();
      }
    });
  }

  onDelete(id: number): void {
    if (!id) {
      this.snackBar.open('Error: ID no válido', 'Cerrar', { duration: 3000 });
      return;
    }

    if (confirm('¿Estás seguro de eliminar este alumno?')) {
      this.alumnosService.deleteAlumno(id).subscribe({
        next: () => {
          // Actualización optimista
          this.dataSource.data = this.dataSource.data.filter(a => a.id !== id);
          this.snackBar.open('Alumno eliminado correctamente', 'Cerrar', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          this.snackBar.open(`Error al eliminar: ${error.message}`, 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
}