import { AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseForm {
  getErrorMessage(control: AbstractControl | null): string {
    if (!control || !control.errors) return '';

    const messages: { [key: string]: string } = {
      required: 'Campo requerido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      email: 'Formato de email inválido'
    };

    const errorKey = Object.keys(control.errors)[0];
    return messages[errorKey] || 'Error desconocido';
  }
}