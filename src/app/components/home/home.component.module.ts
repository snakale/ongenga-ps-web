import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { Routes, Router, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations:  [HomeComponent],
  imports: [
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeComponentModule { }
