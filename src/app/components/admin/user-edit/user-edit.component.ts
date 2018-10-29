import { Component, OnInit } from '@angular/core';
import * as fromUsers from '../../../state/users/adaptor';
import * as UserActions from '../../../state/users/actions';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of as ObservableOf} from 'rxjs';
import { catchError, distinctUntilChanged } from 'rxjs/operators';
import { User } from '../../../models/user.interface';
import { ActivatedRoute } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRoles } from '../../../enums/roles.enum';
import { AdminService } from '../../../services/admin.service';
import { MatSnackBar } from '@angular/material';
import { AppReturnType } from '../../../models/return-type.interface';
import { SchoolGrade } from '../../../enums/grades.enum';
import { SchoolClass } from '../../../enums/class.enum';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  user$ = new BehaviorSubject<User>(null);
  userId: number;
  pageTitle = 'Add new User';
  userForm: FormGroup;
  userRoles = UserRoles;
  schoolGrades = SchoolGrade;
  schoolClasses = SchoolClass;

  busySubmitting = false;
  isNewUser: boolean;

  constructor(
    private store: Store<fromUsers.UsersState>,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params.id;
    this.isNewUser = isNaN(this.userId);    

    this.userForm = this.formBuilder.group({
      names: ['', [
        Validators.required
      ]],
      surname: ['', [
          Validators.required
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      role: ['', [
        Validators.required
      ]],
      teacherGrade: [0],
      teacherClass: [0]
    });
    
    this.patchUserForm();
    
  }

  patchUserForm() {
    if ( !this.isNewUser ) {
      this.userId = +this.userId;
      this.store.select('users').pipe(
        map( (userState: fromUsers.UsersState) => userState.entities[this.userId]),
        catchError( () => ObservableOf(null)),
        distinctUntilChanged(),
        tap( (user: User) => {
          if ( user !== null && user !== undefined ) {
            this.pageTitle = `${user.names} ${user.surname}`;
            this.userForm.patchValue({
              names: user.names, surname: user.surname, email: user.email, role: user.role, 
              teacherClass: user.teacherClass ? user.teacherClass : 0, 
              teacherGrade: user.teacherGrade ? user.teacherGrade : 0
            });
          } 
        })
      ).subscribe();
    }
  }

  async saveUser() {
    
    this.busySubmitting = true;
    const result = await this.saveFormDataToDB();

    if ( result && result.success === true ) {
      this.updateStore(result);
      this.resetForm();      
    } 

    this.notifyUserOfSubmitResult(result);
    this.busySubmitting = false;
  }

  notifyUserOfSubmitResult(result: AppReturnType) {
    if (result.success) {
      if (this.isNewUser) {
        this.snackBar.open('Successfully added new user', '', {duration: 3000});
      } else {
        this.snackBar.open('Successfully updated user information', '', {duration: 5000});
      }   
    } else {
      this.snackBar.open(result.message, '', {duration: 5000});
    }
  }

  saveFormDataToDB() {
    const user = this.userForm.value;
    if (this.isNewUser) {     
      return this.adminService.saveNewUser(user);
    } else {
      return this.adminService.updateUserProfile({...{id: this.userId}, ...user});
    }
  }

  updateStore(result) {
  
    if (this.isNewUser) {
      console.log('saving new user');

      this.store.dispatch( new UserActions.SaveNewUser({...this.userForm.value, ...{id: result.data.id}}));
    } else {
      console.log('Update existing user');
      this.store.dispatch( new UserActions.UpdateUser({user: {id: this.userId, changes: this.userForm.value}}));
    }
  }

  resetForm() {
    if ( this.isNewUser ) {
      this.userForm.reset();
    }
  }

  goBack() {
    this.location.back();
  }

  get names() {
    return this.userForm.get('names');
  }

  get surname() {
    return this.userForm.get('surname');
  }

  get email() {
    return this.userForm.get('email');
  }

  get role() {
    return this.userForm.get('role');
  }

  get teacherGrade() {
    return this.userForm.get('teacherGrade');
  }

  get teacherClass() {
    return this.userForm.get('teacherClass');
  }
}
