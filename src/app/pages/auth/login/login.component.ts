import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseForm } from '../../../shared/utils/base-form';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: false
})
export class LoginComponent {
  hidePassword = true;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public baseForm: BaseForm // Inyección correcta como propiedad pública
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      // Lógica de login aquí
    }
  }
}