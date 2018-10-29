import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from '../../models/student.interface';
import { StudentsService } from '../../services/students.service';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../state/application-state.model';
import { Observable } from 'rxjs';
import { StudentsState } from '../../state/students/adaptor';
import { map, catchError } from 'rxjs/operators';
import { Dictionary } from '@ngrx/entity/src/models';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { of as ObservableOf } from 'rxjs';
import { DeleteStudent } from '../../state/students/actions';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  students$: Observable<Student[]>;

  constructor(
    private studentsService: StudentsService,
    private store: Store<ApplicationState>,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.students$ = this.store.select('students').pipe(
      map( (studentsState: StudentsState) => this.mapDictionaryToEntities(studentsState.entities))
    );
  }

  mapDictionaryToEntities(dictionary: Dictionary<any>): Array<any> {
    return Object.keys(dictionary).map( k => dictionary[k] );
  }

  applyFilter($event) {
    console.log($event);
  }

  selectStudent(student: Student) {
    this.router.navigate([`academic/${student.id}`]);
  }

  async removeStudent(student: Student) {
    const promptResult = await this.promptUserToConfirm({
      title: 'Remove Student', 
      description: `Are you sure you want to remove student: ${student.names} ${student.surname}?`
    });
    
    if (promptResult === false) {
      return;
    }

    const result = await this.studentsService.removeStudent(student).toPromise();

    if (result.success === true) {
      this.store.dispatch( new DeleteStudent({id: '' + student.id}) );
    } else {
      this.snackBar.open(`Failed to remove student: ${result.message}`, '', {duration: 4000});
    }
  }

  async promptUserToConfirm(confirmData): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: confirmData
    });

    return dialogRef.afterClosed().pipe(
      map( r => r === true ? true : false),
      catchError( () => ObservableOf(false))
    ).toPromise();
  }


}
