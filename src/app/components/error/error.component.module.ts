import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorComponent } from './error.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../shared/shared.module';

const routes: Routes = [
  { path: '', component: ErrorComponent }
];

@NgModule({
  declarations:  [ErrorComponent],
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    SharedComponentsModule
  ],
  exports: [RouterModule]
})
export class ErrorComponentModule { }
