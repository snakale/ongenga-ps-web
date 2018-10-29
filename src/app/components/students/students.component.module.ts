import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentsComponent } from './students.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../shared/shared.module';

const routes: Routes = [
  { path: '', component: StudentsComponent }
];

@NgModule({
  declarations:  [StudentsComponent],
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    SharedComponentsModule
  ],
  exports: [RouterModule]
})
export class StudentsComponentModule {}
