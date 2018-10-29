import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, catchError, tap } from 'rxjs/operators';
import { of as ObservableOf, Observable } from 'rxjs';
import { AppReturnType } from '../models/return-type.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'api/auth/';
  private _userLoggedIn = false;

  constructor(
    private http: HttpClient,
  ) { }

  get isUserLoggedIn() {
    return this._userLoggedIn;
  }

  changeUserPassword(data): Observable<AppReturnType> {
    console.dir(data);
    return this.http.put<AppReturnType>(`${this.url}/${data.id}`, data);
  }

  getLoggedInState(): Observable<AppReturnType> {
    return this.http
      .get<AppReturnType>(this.url)
      .pipe(
        first(),
        tap( val => this._userLoggedIn = val && val.success && val.success === true),
        catchError( err => ObservableOf({success: false, message: err} as AppReturnType) )
      );
  }

  logout() {
    return this.http.delete(this.url).toPromise();
  }

  login(email: string, password: string): Promise<any> {
    return this.http
      .post(`${this.url}`, {
        params: { email: email, password: password }
      })
      .pipe(
        tap( (val: AppReturnType) => this._userLoggedIn = val.success)
      )
      .toPromise();
  }

}
