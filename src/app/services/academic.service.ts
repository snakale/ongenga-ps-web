import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppReturnType } from '../models/return-type.interface';
import { catchError } from 'rxjs/operators';
import { of as ObservableOf } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcademicService {

  constructor(
    private http: HttpClient
  ) {}

  getMarkSheet(grade, schoolClass, year, term) {
    const params = {grade, schoolClass, year, term};
    return this.http.get<AppReturnType>(`api/marks/term-marks`, {params}).pipe(
      catchError(e => ObservableOf({success: false, message: e.message} as AppReturnType))
    ).toPromise();
  }

}
