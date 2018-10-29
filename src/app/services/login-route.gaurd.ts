import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UsersState } from '../state/users/adaptor';
import { Store } from '@ngrx/store';
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginRouteGuard implements CanActivate {

  constructor(
      private authService: AuthService,
      private router: Router,
      private store: Store<UsersState>
    ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    return this.getAuthState(route.url);
  }

  async getAuthState(reroute): Promise<boolean> {
    let loggedInState = await this.getLoggedInStateFromStore();

    if (!loggedInState) {
      loggedInState = await this.getLoggedInStateFromAPI();
    }

    if (!loggedInState) {
      this.router.navigate(['/login'], {queryParams: {returnUrl: reroute}});
    }

    return loggedInState;

  }

  async getLoggedInStateFromStore() {
    return await this.store.select('users')
      .pipe(
        first(),
        map( (usersState: UsersState) => usersState.loggedInUser),
        map( loggedInUser => loggedInUser === null ? false : true)
      ).toPromise();
  }

  async getLoggedInStateFromAPI(): Promise<boolean> {
    return this.authService.getLoggedInState().pipe(map(state => state.success)).toPromise();
  }
}
