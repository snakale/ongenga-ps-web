import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { SchoolSubject } from '../../models/subject.interface';

export enum SchoolSubjectActionTypes {
  LOAD_SUBJECT = '[SchoolSubject] Load Users',
  ADD_SUBJECT = '[SchoolSubject] Add User',
  UPSERT_SUBJECT = '[SchoolSubject] Upsert User',
  ADD_SUBJECTS = '[SchoolSubject] Add Users',
  UPSERT_SUBJECTS = '[SchoolSubject] Upsert Users',
  UPDATE_SUBJECT = '[SchoolSubject] Update User',
  UPDATE_SUBJECTS = '[SchoolSubject] Update Users',
  DELETE_SUBJECT = '[SchoolSubject] Delete User',
  DELETE_SUBJECTS = '[SchoolSubject] Delete Users',
  CLEAR_SUBJECTS = '[SchoolSubject] Clear Users',
  ADD_NEW_SUBJECT = '[SchoolSubject Edit_SchoolSubject_PAGE] Save New User to DB',
  SET_SCHOOL_SUBJECTS = '[SchoolSubject] SET Logged in User',
  LOAD_SCHOOL_SUBJECTS = '[SchoolSubject APP INIT] Load All Subjects',
  SET_SELECTED_SUBJECT = '[SchoolSubject SELECT] SET selected Subject'
}

export class LoadSchoolSubjects implements Action {
  readonly type = SchoolSubjectActionTypes.LOAD_SCHOOL_SUBJECTS;
}

export class SetSelectedSchoolSubject implements Action {
  readonly type = SchoolSubjectActionTypes.SET_SELECTED_SUBJECT;
  constructor(public payload: number) {}
}

export class SaveNewSchoolSubject implements Action {
  readonly type = SchoolSubjectActionTypes.ADD_NEW_SUBJECT;
  constructor(public payload: SchoolSubject) {}
}

export class SetSchoolSubjects implements Action {
  readonly type = SchoolSubjectActionTypes.SET_SCHOOL_SUBJECTS;
  constructor(public payload: {subjects: SchoolSubject[]}) {}
}

export class AddSchoolSubject implements Action {
  readonly type = SchoolSubjectActionTypes.ADD_SUBJECT;
  constructor(public payload: { subject: SchoolSubject }) {}
}

export class UpsertSchoolSubject implements Action {
  readonly type = SchoolSubjectActionTypes.UPSERT_SUBJECT;
  constructor(public payload: { subject: SchoolSubject }) {}
}

export class AddSchoolSubjects implements Action {
  readonly type = SchoolSubjectActionTypes.ADD_SUBJECTS;
  constructor(public payload: { subjects: SchoolSubject[] }) {}
}

export class UpsertSchoolSubjects implements Action {
  readonly type = SchoolSubjectActionTypes.UPSERT_SUBJECTS;
  constructor(public payload: { subjects: SchoolSubject[] }) {}
}

export class UpdateSchoolSubject implements Action {
  readonly type = SchoolSubjectActionTypes.UPDATE_SUBJECT;
  constructor(public payload: { subject: Update<SchoolSubject> }) {}
}

export class UpdateSchoolSubjects implements Action {
  readonly type = SchoolSubjectActionTypes.UPDATE_SUBJECTS;
  constructor(public payload: { subjects: Update<SchoolSubject>[] }) {}
}

export class DeleteSchoolSubject implements Action {
  readonly type = SchoolSubjectActionTypes.DELETE_SUBJECT;
  constructor(public payload: { id: string }) {}
}

export class DeleteSchoolSubjects implements Action {
  readonly type = SchoolSubjectActionTypes.DELETE_SUBJECTS;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearSchoolSubjects implements Action {
  readonly type = SchoolSubjectActionTypes.CLEAR_SUBJECTS;
}

export type SchoolSubjectActionsUnion =
  | LoadSchoolSubjects
  | SetSelectedSchoolSubject
  | AddSchoolSubject
  | UpsertSchoolSubject
  | AddSchoolSubjects
  | UpsertSchoolSubjects
  | UpdateSchoolSubject
  | UpdateSchoolSubjects
  | DeleteSchoolSubject
  | DeleteSchoolSubjects
  | ClearSchoolSubjects
  | SaveNewSchoolSubject  
  | SetSchoolSubjects;
