import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { Routes, Router, RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../shared/shared.module';

const routes: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  declarations:  [LoginComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedComponentsModule
  ],
  exports: [RouterModule]
})
export class LoginComponentModule { }
