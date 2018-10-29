import { NgModule } from '@angular/core';
import { AdminComponent } from './main/admin.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsModule } from '../shared/shared.module';
import { AdminSubjectsListComponent } from './subjects-list/subjects-list.component';
import { AdminUsersListComponent } from './users-list/users-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { SubjectEditComponent } from './subject-edit/subject-edit.component';
import { UserProfileFormComponent } from './forms/user-profile/user-profile.component';
import { UserPasswordFormComponent } from './forms/user-password/user-password.component';
import { StudentEditComponent } from './student-edit/student-edit.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'new-user', component: UserEditComponent },
  { path: 'new-subject', component: SubjectEditComponent },
  { path: 'new-student', component: StudentEditComponent },
  { path: 'subject-edit/:id', component: SubjectEditComponent },
  { path: 'user-edit/:id', component: UserEditComponent },
  { path: 'students-edit/:id', component: StudentEditComponent }
];

@NgModule({
  declarations:  [
    AdminComponent,
    AdminSubjectsListComponent,
    AdminUsersListComponent,
    UserEditComponent,
    SubjectEditComponent,
    UserPasswordFormComponent,
    UserProfileFormComponent,
    StudentEditComponent
  ],
  imports: [
    SharedComponentsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminComponentModule { }
