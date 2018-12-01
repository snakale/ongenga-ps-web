
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentActionsUnion, AddStudents, StudentActionTypes } from './actions';
import { map, mergeMap } from 'rxjs/operators';
import { UserActionTypes } from '../users/actions';
import { StudentsService } from '../../services/students.service';
import { Student } from '../../models/student.interface';

@Injectable()
export class StudentsStateEffects {

    constructor(
        private actions: Actions,
        private studentsService: StudentsService
    ) {}

    @Effect()
    loadAllStudents: Observable<StudentActionsUnion> = this.actions
        .pipe(
            ofType(StudentActionTypes.LOAD_STUDENTS, UserActionTypes.SET_LOGGED_IN_USER),
            mergeMap( () => this.studentsService.getAllStudents() ),
            map( (students: Student[]) => new AddStudents({students: students}))
        );

}

