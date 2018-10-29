

// LoadLoggedInUser: Hit API and the returned user must then be set as logged in user

// SaveNewUser: Hit api, and the return user must then be added to list

// On update school subject, save to DB

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, merge } from 'rxjs';
import { UserActionsUnion, UserActionTypes, AddUsers, SetLoggedInUser, FailedToLoadAuthState, UpdateUser } from './actions';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { map, mergeMap, tap } from 'rxjs/operators';
import { User } from '../../models/user.interface';


@Injectable()
export class UsersEffects {

    constructor(
        private actions: Actions,
        private adminService: AdminService,
        private authService: AuthService
    ) {}

    @Effect()
    loadLoggedInUser: Observable<UserActionsUnion> = this.actions
        .pipe(
            ofType(UserActionTypes.LOAD_LOGGED_IN_USER),
            mergeMap( () => this.authService.getLoggedInState() ),
            map( res => res.success ? new SetLoggedInUser(res.data) : new FailedToLoadAuthState() )
        );

    @Effect()
    loadAllUsers: Observable<UserActionsUnion> = this.actions
        .pipe(
            ofType(UserActionTypes.LOAD_USERS, UserActionTypes.SET_LOGGED_IN_USER),
            mergeMap( () => this.adminService.getAllUsers() ),
            map( (users: User[]) => new AddUsers({users: users}))
        );

    /*@Effect()
    updateUser: Observable<UserActionsUnion> = this.actions
        .pipe(
            ofType(UserActionTypes.UPDATE_USER),
            map( (act: UpdateUser) => act.payload),
            mergeMap(this.adminService.updateUserProfile)
        );*/

}
