import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AcademicDashboardComponent } from './academic-dashboard/academic-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ClassMarkSheetComponent } from './class-mark-sheet/class-mark-sheet.component';
import { SharedComponentsModule } from '../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';

const routes: Routes = [
  { path: '', component: AcademicDashboardComponent }
];

@NgModule({
  declarations:  [AcademicDashboardComponent, ClassMarkSheetComponent],
  imports: [
    SharedComponentsModule,
    FormsModule,
    RouterModule.forChild(routes),
    AgGridModule.withComponents([])
  ],
  exports: [RouterModule]
})
export class AcademicComponentModule { }
