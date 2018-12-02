import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../state/application-state.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../../models/user.interface';
import { Router } from '@angular/router';
import { SchoolSubject } from '../../../models/subject.interface';
import { map, tap, catchError } from 'rxjs/operators';
import { Dictionary } from '@ngrx/entity/src/models';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { UpdateUser, DeleteUser } from '../../../state/users/actions';
import { AdminService } from '../../../services/admin.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { of as ObservableOf } from 'rxjs';
import { Student } from '../../../models/student.interface';
import { StudentsState } from '../../../state/students/adaptor';
import { DeleteStudent } from '../../../state/students/actions';
import { UserRoles } from '../../../enums/roles.enum';
import { UsersState } from '../../../state/users/adaptor';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  currentUser$: Observable<User>;
  teachers$: Observable<User[]>;
  allAppUsers$: Observable<User[]>;
  allSchoolSubjects$: Observable<SchoolSubject[]>;
  currentUser: User;
  students$: Observable<Student[]>;

  userPasswordFormReadyToSubmit = new BehaviorSubject<boolean>(false);

  constructor(
    private store: Store<ApplicationState>,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {

    this.allAppUsers$ = this.store.select('users')
      .pipe(
        map(userState => this.mapDictionaryToEntities(userState.entities))
      );

    this.allSchoolSubjects$ = this.store.select('subjects')
      .pipe(
        map(subjectsState => this.mapDictionaryToEntities(subjectsState.entities))
      );

    this.currentUser$ = this.store.select('users')
      .pipe(
        map(users => users.loggedInUser),
        tap( val => this.currentUser = val)
      );

    this.teachers$ = this.store.select('users')
      .pipe(
        map( (entityObject: UsersState) => this.mapDictionaryToEntities(entityObject.entities) ),
        map( users => this.getTeachersFromUsersArray(users) ),
      );

    this.students$ = this.store.select('students')
      .pipe(
        map( (studentsState: StudentsState) => this.mapDictionaryToEntities(studentsState.entities))
      );

  }

  isAdminUser(user: User): boolean {
    if (user && user.role) {
      return user.role === UserRoles.Administrator;
    } 
    return false;    
  }

  getTeachersFromUsersArray(users: User[]): User[] {
    return users.filter(user => user.role === UserRoles.Teacher);
  }

  mapDictionaryToEntities(dictionary: Dictionary<any>): Array<any> {
    return Object.keys(dictionary).map( k => dictionary[k] );
  }

  selectUserForEditing(user: User) {
    this.router.navigate([`/admin/user-edit/${user.id}`]);
  }

  selectSubjectForEditing(schoolSubject: SchoolSubject) {
    this.router.navigate([`/admin/subject-edit/${schoolSubject.id}`]);
  }

  addNewStudent() {
    this.router.navigate(['/admin/new-student']);
  }

  onAddNewSubject() {
    this.router.navigate([`/admin/new-subject`]);
  }

  onAddNewUser() {
    this.router.navigate([`/admin/new-user`]);
  }

  updateCurrentUserPassword(data) {
    this.authService.changeUserPassword(data).toPromise()
    .then(result => this.snackBar.open(result.message, '', {duration: 3000}))
    .catch( e => this.snackBar.open(e.message, 'Retry', {duration: 3000}));
  }

  async updateUserProfile(data) {

    const user = {...{id: this.currentUser.id}, ...data};
        
    this.adminService.updateUserProfile(user)
      .then( result => {
        if (result.success) {
          this.store.dispatch( new UpdateUser({user: user}));
          this.snackBar.open(`Profile successfully updated`, '', {duration: 3000});
        } else {
          this.snackBar.open(`${result.message}`, '', {duration: 3000});
        }
      })
      .catch( e => this.snackBar.open(`Failed to update profile with error: ${e.message}`, 'Retry', {duration: 3000}));
    
  }

  async promptUserToConfirm(confirmData): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: confirmData
    });

    return dialogRef.afterClosed().pipe(
      map( r => r === true ? true : false),
      catchError( () => ObservableOf(false))
    ).toPromise();
  }

  async removeUser(user: User) {
    
    const promptResult = await this.promptUserToConfirm({
      title: 'Remove User', 
      description: `Are you sure you want to remove ${user.names} ${user.surname}?`
    });
    
    if (promptResult === false) {
      return;
    }

    const result = await this.adminService.removeUser(user).toPromise();

    if (result.success === true) {
      this.store.dispatch( new DeleteUser({id: '' + user.id}) );
    } else {
      this.snackBar.open(`Failed to remove user: ${result.message}`, '', {duration: 4000});
    }
  }

  selectStudent(student: Student) {
    this.router.navigate([`admin/student-edit/${student.id}`]);
  }

  async removeStudent(student: Student) {
    const promptResult = await this.promptUserToConfirm({
      title: 'Remove Student', 
      description: `Are you sure you want to remove student: ${student.names} ${student.surname}?`
    });
    
    if (promptResult === false) {
      return;
    }

    const result = await this.adminService.removeStudent(student).toPromise();

    if (result.success === true) {
      this.store.dispatch( new DeleteStudent({id: '' + student.id}) );
    } else {
      this.snackBar.open(`Failed to remove student: ${result.message}`, '', {duration: 4000});
    }
  }

  async removeSubject(subject) {

    const promptResult = await this.promptUserToConfirm({
      title: 'Remove Subject', 
      description: `Are you sure you want to remove the grade ${ (+subject.grade) + 1} subject: ${subject.name}?`
    });
    
    if (promptResult === false) {
      return;
    }

    const result = await this.adminService.removeSubject(subject).toPromise();

    if (result.success === true) {
      this.store.dispatch( new DeleteUser({id: subject.id}) );
    } else {
      this.snackBar.open(`Failed to remove subject: ${result.message}`, '', {duration: 4000});
    }
  }
}
