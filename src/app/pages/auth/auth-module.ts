import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { Auth } from './auth';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    Auth
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
