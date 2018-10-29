import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of as ObservableOf, Observable } from 'rxjs';
import { AppReturnType } from '../models/return-type.interface';
import { Student } from '../models/student.interface';
import { Mark, MarksSearchParams } from '../models/mark.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(
    private http: HttpClient
  ) { }

  addNewStudent(student: Student): Observable<AppReturnType> {
    return this.http
      .post<AppReturnType>(`api/students/`, student)
      .pipe(
        map( result => result ? result : {success: false, message: 'Unexpected null returned'}),
        catchError( err => ObservableOf({success: false, message: err.message}) )
      );
  }

  getTeacherTermMarks(searchParams: MarksSearchParams): Observable<Mark[]> {

    const params = { teacher: '' + searchParams.teacher.id, year: '' + searchParams.year, term: '' + searchParams.term };

    return this.http
      .get<AppReturnType>(`api/marks/`, { params: params } )
      .pipe(
        map( result => (result && result.success === true) ? result.data : []),
        catchError( () => ObservableOf(undefined) )
      );
  }

  removeStudent(student: Student): Observable<AppReturnType> {
    return this.http
      .delete<AppReturnType>(`api/students/${student.id}`)
      .pipe(
        catchError( err => ObservableOf({success: false, message: err.message}) )
      );
  }

  updateStudent(student: Student): Observable<AppReturnType> {
    return this.http
      .put<AppReturnType>(`api/students/${student.id}`, student)
      .pipe(
        catchError( err => ObservableOf({success: false, message: err.message}) )
      );
  }

  getAllStudents(): Promise<Student[]> {
    return this.http
      .get<AppReturnType>(`api/students/`)
      .pipe(
        map( val => val && val.success && val.success === true ? val.data : []),
        catchError( () => ObservableOf([]) )
      ).toPromise();
  }

  getStudentMarks(studentId: number): Promise<AppReturnType> {
    return this.http
      .get<AppReturnType>(`api/marks/${studentId}`)
      .pipe(
        catchError( e => ObservableOf({success: false, message: e.message}))
      ).toPromise();
  }

}
