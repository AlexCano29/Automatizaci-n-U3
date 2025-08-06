import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';

const myModules: any = [
  MatButtonModule,
];

@NgModule({
  imports: [...myModules],
  exports: [...myModules],
})
export class MaterialModule { }
