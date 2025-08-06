import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Injectable ({ providedIn: 'root' })
export class BaseForm {

    constructor() { }

    isInValidFiled(form: AbstractControl | null ): boolean {
        var bandera = false;
        if (form) {
            bandera = form.touched || form.dirty && form.invalid
        }
        return bandera;
    }

    getErrorMessage(form: AbstractControl | null) {
        let message = '';
        if (form) {
            const { errors } = form;

            if (errors) {
                const messages: any = {
                    required: 'Campo Requerido',
                    email: 'Formato invalido',
                    pattern: 'Formato Invalido',
                    min: 'El rngo no es Correcto',
                    max: 'El rango no es Correcto',
                    minlength: 'Formato Invalido'
                }

                const errorKey = Object.keys(errors).find(Boolean);
                if (errorKey) message = messages[errorKey];
            }
        }
        return message;
     }
}