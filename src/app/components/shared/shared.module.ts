import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { 
    MatGridListModule, 
    MatTabsModule, 
    MatIconModule, 
    MatSnackBarModule, 
    MatSnackBar, 
    MatDialogModule,
    MatNativeDateModule
} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { EnumToArrayPipe } from '../../pipes/enumTorArray.pipe';
import { EnumToStringPipe } from '../../pipes/enumToString.pipe';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { StudentsListComponent } from './students-list/students-list.component';

const components = [
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatToolbarModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
];

@NgModule({
    declarations: [
        EnumToArrayPipe, 
        EnumToStringPipe, 
        ConfirmDialogComponent,
        StudentsListComponent
    ],
    imports: [ 
        ...components 
    ],
    exports: [ 
        EnumToArrayPipe, 
        EnumToStringPipe, 
        ConfirmDialogComponent, 
        StudentsListComponent,
        ...components 
    ],
    providers: [MatSnackBar],
    entryComponents: [ConfirmDialogComponent]
})
export class SharedComponentsModule {}
