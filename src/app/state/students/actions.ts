import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Student } from '../../models/student.interface';

export enum StudentActionTypes {
  LOAD_STUDENT = '[Student] Load Students',
  ADD_STUDENT = '[Student] Add Student',
  UPSERT_STUDENT = '[Student] Upsert Student',
  ADD_STUDENTS = '[Student] Add Students',
  UPSERT_STUDENTS = '[Student] Upsert Students',
  UPDATE_STUDENT = '[Student] Update Student',
  UPDATE_STUDENTS = '[Student] Update Students',
  DELETE_STUDENT = '[Student] Delete Student',
  DELETE_STUDENTS = '[Student] Delete Students',
  CLEAR_STUDENTS = '[Student] Clear Students',
  ADD_NEW_STUDENT = '[Student Edit_Student_PAGE] Save New Student to DB',
  SET_STUDENTS = '[Student] SET Logged in Student',
  LOAD_STUDENTS = '[Student APP INIT] Load All Students',
  SET_SELECTED_STUDENT = '[Student SELECT] SET selected Student'
}

export class LoadStudents implements Action {
  readonly type = StudentActionTypes.LOAD_STUDENTS;
}

export class SaveNewStudent implements Action {
  readonly type = StudentActionTypes.ADD_NEW_STUDENT;
  constructor(public payload: Student) {}
}

export class SetStudents implements Action {
  readonly type = StudentActionTypes.SET_STUDENTS;
  constructor(public payload: {students: Student[]}) {}
}

export class AddStudent implements Action {
  readonly type = StudentActionTypes.ADD_STUDENT;
  constructor(public payload: { student: Student }) {}
}

export class UpsertStudent implements Action {
  readonly type = StudentActionTypes.UPSERT_STUDENT;
  constructor(public payload: { student: Student }) {}
}

export class AddStudents implements Action {
  readonly type = StudentActionTypes.ADD_STUDENTS;
  constructor(public payload: { students: Student[] }) {}
}

export class UpsertStudents implements Action {
  readonly type = StudentActionTypes.UPSERT_STUDENTS;
  constructor(public payload: { students: Student[] }) {}
}

export class UpdateStudent implements Action {
  readonly type = StudentActionTypes.UPDATE_STUDENT;
  constructor(public payload: { student: Update<Student> }) {}
}

export class UpdateStudents implements Action {
  readonly type = StudentActionTypes.UPDATE_STUDENTS;
  constructor(public payload: { students: Update<Student>[] }) {}
}

export class DeleteStudent implements Action {
  readonly type = StudentActionTypes.DELETE_STUDENT;
  constructor(public payload: { id: string }) {}
}

export class DeleteStudents implements Action {
  readonly type = StudentActionTypes.DELETE_STUDENTS;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearStudents implements Action {
  readonly type = StudentActionTypes.CLEAR_STUDENTS;
}

export type StudentActionsUnion =
  | LoadStudents
  | AddStudent
  | UpsertStudent
  | AddStudents
  | UpsertStudents
  | UpdateStudent
  | UpdateStudents
  | DeleteStudent
  | DeleteStudents
  | ClearStudents
  | SaveNewStudent  
  | SetStudents;
