import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of as ObservableOf, BehaviorSubject } from 'rxjs';
import { StudentsService } from '../../../services/students.service';
import { User } from '../../../models/user.interface';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../state/application-state.model';
import { Dictionary } from '@ngrx/entity/src/models';
import { UsersState } from '../../../state/users/adaptor';
import { map, catchError, distinctUntilChanged, tap } from 'rxjs/operators';
import { UserRoles } from '../../../enums/roles.enum';
import { MatSnackBar, MAT_DATE_FORMATS } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AppReturnType } from '../../../models/return-type.interface';
import { Location } from '@angular/common';
import { StudentsState } from '../../../state/students/adaptor';
import { Student } from '../../../models/student.interface';
import { AddStudent, UpdateStudent } from '../../../state/students/actions';
import { SchoolGrade } from 'src/app/enums/grades.enum';
import { SchoolClass } from 'src/app/enums/class.enum';

@Component({
  selector: 'app-student-edit',
  templateUrl: `./student-edit.component.html`,
  styleUrls: ['./student-edit.component.scss'],
  providers: [{
      provide: MAT_DATE_FORMATS, useValue: {
          parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
          display: {
              dateInput: {month: 'short', year: 'numeric', day: 'numeric'},
              monthYearLabel: {year: 'numeric'}
          }
      }
  }]
})
export class StudentEditComponent implements OnInit {

    studentForm: FormGroup;
    teachers$ = new BehaviorSubject<User[]>([]);
    busySubmitting = false;
    pageTitle = 'New Student';

    studentId: number;
    isNewStudent: boolean;

    schoolGrades = SchoolGrade;
    schoolClasses = SchoolClass;

    minPickerDate = new Date(1950, 0, 1);
    maxPickerDate = new Date();
    
    constructor(
        private studentsService: StudentsService,
        private store: Store<ApplicationState>,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar
    ) { }

  ngOnInit() {

    this.studentId = this.activatedRoute.snapshot.params.id;
    this.isNewStudent = isNaN(this.studentId);

    this.store.select('users').pipe(
      map( (usersState: UsersState) => this.mapDictionaryToEntities(usersState.entities)),
      map( (users: User[]) => users.filter( user => user.role === UserRoles.Teacher)),
      tap( teachers => this.teachers$.next(teachers) )
    ).subscribe();

    this.studentForm = this.formBuilder.group({
        names: ['', Validators.required],
        surname: ['', Validators.required],
        studentGrade: ['', Validators.required],
        studentClass: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        gender: ['', Validators.required],
        teacher: ['', Validators.required],
        parent1: this.formBuilder.group({
          id: [],
          name: [],
          surname: [],
          contactDetails: []
        }),
        parent2: this.formBuilder.group({
          id: [],
          name: [],
          surname: [],
          contactDetails: []
        })
    });

    // If this is in student edit mode, populate form with values
    this.patchForm();

    // Update student grade and class based on teacher's values
    this.studentForm.get('teacher').valueChanges
    .pipe(
      tap( id => {
        const teacher = this.teachers$.value.find( (t: User) => t.id === id);
        this.studentForm.patchValue({studentGrade: teacher.teacherGrade, studentClass: teacher.teacherClass});
      })
    ).    
    subscribe();

  }

  get dateOfBirth() {
    return this.studentForm.get('dateOfBirth');
  }

  get studentClass() {
    return this.studentForm.get('studentClass');
  }

  get studentGrade() {
    return this.studentForm.get('studentGrade');
  }

  get gender() {
    return this.studentForm.get('gender');
  }

  get teacher() {
    return this.studentForm.get('teacher');
  }

  get names() {
    return this.studentForm.get('names');
  }

  get surname() {
    return this.studentForm.get('surname');
  }

  async patchForm() {

    if ( this.isNewStudent ) {
      return;
    }

    this.studentId = +this.studentId;
    this.store.select('students').pipe(
      map( (studentsState: StudentsState) => studentsState.entities[this.studentId]),
      catchError( () => ObservableOf(null)),
      distinctUntilChanged(),
      tap( (student: Student) => {
        if ( student !== null && student !== undefined ) {
          this.pageTitle = `Edit Student:  ${student.names} ${student.surname}`;
          const func = this.patchStudentForm.bind(this);
          func(student);
        } 
      })
    ).subscribe();

  }

  async patchStudentForm(student: Student) {

    this.studentForm
      .patchValue({
        names: student.names, 
        surname: student.surname, 
        teacher: student.registerTeacherId,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        studentGrade: this.teachers$.value
                        .find( teacher => teacher.id === student.registerTeacherId ).teacherGrade,
        studentClass: this.teachers$.value
                        .find( teacher => teacher.id === student.registerTeacherId ).teacherClass
      });

    const studentParent = await this.studentsService.getStudentParents(student.id);

    if (studentParent.parent1) {
      this.studentForm
        .patchValue({
          'parent1': {
            id: studentParent.parent1.id,
            name: studentParent.parent1.name,
            surname: studentParent.parent1.surname,
            contactDetails: studentParent.parent1.contactDetails
          }
        });
    }

    if (studentParent.parent2) {
      this.studentForm
        .patchValue({
          'parent2': {
            id: studentParent.parent2.id,
            name: studentParent.parent2.name,
            surname: studentParent.parent2.surname,
            contactDetails: studentParent.parent2.contactDetails
          }
        });
    }
  }

  mapDictionaryToEntities(dictionary: Dictionary<any>): Array<any> {
    return Object.keys(dictionary).map( k => dictionary[k] );
  }

  async saveStudent() {
    this.busySubmitting = true;
    const result = await this.saveFormDataToDB().toPromise();

    if (result.success) {
      this.updateStore(result); // First update the store before resetting the form
      this.resetForm();      
    } 

    this.notifyUserOfSubmitResult(result);
    this.busySubmitting = false;
  }

  notifyUserOfSubmitResult(result: AppReturnType) {
    if (result.success) {
      if (this.isNewStudent) {
        this.snackBar.open('Successfully added new student', '', {duration: 3000});
      } else {
        this.snackBar.open('Successfully updated student information', '', {duration: 5000});
      }   
    } else {
      this.snackBar.open(result.message, '', {duration: 5000});
    }
  }

  saveFormDataToDB() {
    const teacher: User = this.teachers$.value.find( t => t.id === this.teacher.value);
    const student = { ...this.studentForm.value, ...{grade: teacher.teacherGrade, class: teacher.teacherClass}};
    if (this.isNewStudent) {     
      return this.studentsService.addNewStudent(student);
    } else {
      return this.studentsService.updateStudent({...{id: this.studentId}, ...student});
    }
  }

  updateStore(result) {
    if (this.isNewStudent) {
      this.store.dispatch( new AddStudent({student: result.data}));
    } else {
      this.store.dispatch( new UpdateStudent({student: {id: this.studentId, changes: this.studentForm.value}}));
    }
  }

  resetForm() {
    if ( this.isNewStudent ) {
      this.studentForm.reset();
    }
  }

  goBack() {
    this.location.back();
  }

}
