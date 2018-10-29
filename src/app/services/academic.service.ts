import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppReturnType } from '../models/return-type.interface';
import { catchError } from 'rxjs/operators';
import { of as ObservableOf } from 'rxjs';
import { Mark } from '../models/mark.interface';

@Injectable({
  providedIn: 'root'
})
export class AcademicService {

  constructor(
    private http: HttpClient
  ) {}

  getMarkSheet({grade, schoolClass, year, term}) {
    const params = {grade, schoolClass, year, term};
    return this.http.get<AppReturnType>(`api/marks/term-marks`, {params}).pipe(
      catchError(e => ObservableOf({success: false, message: e.message} as AppReturnType))
    ).toPromise();
  }

  saveMarkSheetMarks(marks: Mark[], { year, term, grade, schoolClass } ) {
    return this.http.post<AppReturnType>(`api/marks/term-marks`, {marks, year, term, grade, schoolClass}).pipe(
      catchError(e => ObservableOf({success: false, message: e.message} as AppReturnType))
    ).toPromise();
  }

}
