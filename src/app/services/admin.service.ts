import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppReturnType } from '../models/return-type.interface';
import { first, catchError, map, tap } from 'rxjs/operators';
import { of as ObservableOf, Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { SchoolSubject } from '../models/subject.interface';
import { Student } from '../models/student.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient
  ) {}

  updateUserProfile(data) {
    return this.http.put<AppReturnType>(`api/users/${data.id}`, data).pipe(
      catchError(e => ObservableOf({success: false, message: e.message}))
    ).toPromise();
  }

  updateSchoolSubject(data) {
    return this.http.put<AppReturnType>(`api/subjects/${data.id}`, data).pipe(
      catchError(e => ObservableOf({success: false, message: e.message}))
    ).toPromise();
  }

  saveNewUser(data) {
    return this.http.post<AppReturnType>(`api/users/new`, data).pipe(
      catchError(e => ObservableOf({success: false, message: e.message} as AppReturnType))
    ).toPromise();
  }

  saveNewSubject(data) {
    return this.http.post<AppReturnType>(`api/subjects/new`, data).pipe(
      catchError(e => ObservableOf({success: false, message: e.message} as AppReturnType))
    ).toPromise();
  }

  getAllSubjects() {
    return this.http
      .get<AppReturnType>(`api/subjects/`)
      .pipe(
        first(),
        map( val => val && val.success && val.success === true ? val.data : []),
        catchError( () => ObservableOf([]) )
      ).toPromise();
  }

  getAllUsers() {
    return this.http
      .get<AppReturnType>(`api/users/`)
      .pipe(
        first(),
        map( val => val && val.success && val.success === true ? val.data : []),
        catchError( () => ObservableOf([]))
      ).toPromise();
  }

  removeUser(user: User): Observable<AppReturnType> {
    return this.http
      .delete<AppReturnType>(`api/users/${user.id}`)
      .pipe(
        catchError( e => ObservableOf({success: false, message: e.message}))
      );
  }

  removeSubject(subject: SchoolSubject): Observable<AppReturnType> {
    return this.http
      .delete<AppReturnType>(`api/subjects/${subject.id}`)
      .pipe(
        catchError( e => ObservableOf({success: false, message: e.message}))
      );
  }

  removeStudent(student: Student): Observable<AppReturnType> {
    return this.http
      .delete<AppReturnType>(`api/students/${student.id}`)
      .pipe(
        catchError( e => ObservableOf({success: false, message: e.message}))
      );
  }

}
