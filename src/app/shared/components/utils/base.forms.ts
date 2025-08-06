import { Injectable } from "@angular/core";
import { AbstractControl } from '@angular/forms';


@Injectable({
  providedIn: "root",
})
export class BaseForms {

  constructor() {}

  isInvalidField(form: AbstractControl | null, fieldName: string): boolean {
    var bandera = false;

    if (form) {
      const field = form.get(fieldName);
      if (field) {
        bandera = field.touched || field.dirty && field.invalid;
      }
    }
    return bandera;
  }

  getErrorMessage(form: AbstractControl | null) {
    let message = '';
    if (form) {
      const { errors = null } = form;
      if (errors) {
        const messages: any = {
          required: 'Este campo es Requerido',
          email: 'El correo electrónico no es válido',
          pattern: 'El formato del campo es inválido',
          min: 'El valor es menor al mínimo permitido',
          max: 'El valor es mayor al máximo permitido',
          minlength: 'El valor es menor al mínimo de caracteres permitidos',
          maxlength: 'El valor es mayor al máximo de caracteres permitidos',
        };

        const errorKey = Object.keys(errors).find(key => !!errors[key]);
        if (errorKey) message = messages[errorKey];
      }
    }
    return message;
  }

}
