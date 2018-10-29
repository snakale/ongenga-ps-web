

// LoadLoggedInUser: Hit API and the returned user must then be set as logged in user

// SaveNewUser: Hit api, and the return user must then be added to list

// On update school subject, save to DB

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolSubjectActionsUnion, AddSchoolSubjects, SchoolSubjectActionTypes } from './actions';
import { AdminService } from '../../services/admin.service';
import { map, mergeMap, tap } from 'rxjs/operators';
import { SchoolSubject } from '../../models/subject.interface';
import { UserActionTypes } from '../users/actions';


@Injectable()
export class SchoolSubjectsEffects {

    constructor(
        private actions: Actions,
        private adminService: AdminService
    ) {}

    /*@Effect()
    loadLoggedInUser: Observable<UserActionsUnion> = this.actions
        .pipe(
            ofType(UserActionTypes.LOAD_LOGGED_IN_USER),
            // map( (action: LoadLoggedInUser) => false),
            mergeMap( () => this.authService.getLoggedInState() ),
            map( res => res.success ),
            map( (users: User) => new SetLoggedInUser(users))
        );*/

    @Effect()
    loadAllSchoolSubjects: Observable<SchoolSubjectActionsUnion> = this.actions
        .pipe(
            ofType(SchoolSubjectActionTypes.LOAD_SCHOOL_SUBJECTS, UserActionTypes.SET_LOGGED_IN_USER),
            mergeMap( () => this.adminService.getAllSubjects() ),
            map( (users: SchoolSubject[]) => new AddSchoolSubjects({subjects: users}))
        );

}

