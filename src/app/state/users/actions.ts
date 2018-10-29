import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { User } from '../../models/user.interface';

export enum UserActionTypes {
  LOAD_USERS = '[User] Load Users',
  ADD_USER = '[User] Add User',
  UPSERT_USER = '[User] Upsert User',
  ADD_USERS = '[User] Add Users',
  UPSERT_USERS = '[User] Upsert Users',
  UPDATE_USER = '[User] Update User',
  UPDATE_USERS = '[User] Update Users',
  DELETE_USER = '[User] Delete User',
  DELETE_USERS = '[User] Delete Users',
  CLEAR_USERS = '[User] Clear Users',
  ADD_NEW_USER = '[User Edit_User_PAGE] Save New User to DB',
  SET_LOGGED_IN_USER = '[User] SET Logged in User',
  LOG_USER_OUT = '[User] Logout',
  LOAD_LOGGED_IN_USER = '[User APP INIT] Load Auth State',
  SET_SELECTED_USER = '[User SET_SELECTED] SET Selected User',
  FAILED_TO_AUTH = '[User FAILED_TO_AUTH] User Effect: Failed to Authenticate',
  UPDATE_USER_PASSWORD = '[User UPDATE_AUTH] Update Password BTN CLICK'
}

export class LoadLoggedInUser implements Action {
  readonly type = UserActionTypes.LOAD_LOGGED_IN_USER;
}

export class UpdateUserPassword implements Action {
  readonly type = UserActionTypes.UPDATE_USER_PASSWORD;
  constructor(public payload: any) {}
}

export class SetSelectedUser implements Action {
  readonly type = UserActionTypes.SET_SELECTED_USER;
  constructor(public payload: number) {}
}

export class SaveNewUser implements Action {
  readonly type = UserActionTypes.ADD_NEW_USER;
  constructor(public payload: User) {}
}

export class SetLoggedInUser implements Action {
  readonly type = UserActionTypes.SET_LOGGED_IN_USER;
  constructor(public payload: User) {}
}

export class FailedToLoadAuthState implements Action {
  readonly type = UserActionTypes.FAILED_TO_AUTH;
}

export class LogUserOut implements Action {
  readonly type = UserActionTypes.LOG_USER_OUT;
}

export class LoadUsers implements Action {
  readonly type = UserActionTypes.LOAD_USERS;
  constructor(public payload: { users: User[] }) {}
}

export class AddUser implements Action {
  readonly type = UserActionTypes.ADD_USER;
  constructor(public payload: { user: User }) {}
}

export class UpsertUser implements Action {
  readonly type = UserActionTypes.UPSERT_USER;
  constructor(public payload: { user: User }) {}
}

export class AddUsers implements Action {
  readonly type = UserActionTypes.ADD_USERS;
  constructor(public payload: { users: User[] }) {}
}

export class UpsertUsers implements Action {
  readonly type = UserActionTypes.UPSERT_USERS;
  constructor(public payload: { users: User[] }) {}
}

export class UpdateUser implements Action {
  readonly type = UserActionTypes.UPDATE_USER;
  constructor(public payload: { user: Update<User> }) {}
}

export class UpdateUsers implements Action {
  readonly type = UserActionTypes.UPDATE_USERS;
  constructor(public payload: { users: Update<User>[] }) {}
}

export class DeleteUser implements Action {
  readonly type = UserActionTypes.DELETE_USER;
  constructor(public payload: { id: string }) {}
}

export class DeleteUsers implements Action {
  readonly type = UserActionTypes.DELETE_USERS;
  constructor(public payload: { ids: string[] }) {}
}

export class ClearUsers implements Action {
  readonly type = UserActionTypes.CLEAR_USERS;
}

export type UserActionsUnion =
  | UpdateUserPassword
  | LoadUsers
  | FailedToLoadAuthState
  | AddUser
  | UpsertUser
  | AddUsers
  | UpsertUsers
  | UpdateUser
  | UpdateUsers
  | DeleteUser
  | DeleteUsers
  | ClearUsers
  | LoadLoggedInUser  
  | SaveNewUser  
  | SetLoggedInUser  
  | SetSelectedUser
  | LogUserOut;
