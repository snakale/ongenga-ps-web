import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationState } from '../../state/application-state.model';
import { Store } from '@ngrx/store';
import * as UserActions from './../../state/users/actions';
import { AppReturnType } from '../../models/return-type.interface';

@Component({
  selector: 'app-login',
  templateUrl: `./login.component.html`,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submissionAuthenticating = false;
  authenticationMessage = '';
  authenticationSuccess = false;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<ApplicationState>
  ) { }

  ngOnInit() {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.loginForm = this.fb.group({
        email: [
          '',
          [Validators.required, Validators.email]
        ],
        password: [
          '',
          [Validators.required, Validators.minLength(5)]
        ]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  authenticateUser() { 
    this.authenticationMessage = '';
    this.submissionAuthenticating = true;
    this.authService.login(this.email.value, this.password.value).then( (res: AppReturnType) => {

      if (res.success === true) {
        this.store.dispatch(new UserActions.SetLoggedInUser(res.data));
        this.router.navigate([`/${this.returnUrl}`]);
      }

      this.authenticationMessage = res.message;
      this.authenticationSuccess = res.success;
      this.submissionAuthenticating = false;
    }).catch( e => {
      this.authenticationMessage = e.message;
      this.submissionAuthenticating = false;
    });
    
  }

}
