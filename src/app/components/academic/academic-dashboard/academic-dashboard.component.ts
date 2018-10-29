import { Component, OnInit } from '@angular/core';
import { Student } from '../../../models/student.interface';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../state/application-state.model';
import { Observable, BehaviorSubject, of as observableOf } from 'rxjs';
import { tap, first, map, takeUntil, takeWhile, catchError } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import range from 'lodash/range';
import { ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { AcademicService } from 'src/app/services/academic.service';
import { UserRoles } from 'src/app/enums/roles.enum';
import { Mark } from 'src/app/models/mark.interface';
import { SchoolGrade } from 'src/app/enums/grades.enum';
import { SchoolClass } from 'src/app/enums/class.enum';
import { SchoolSubject } from 'src/app/models/subject.interface';
import { Dictionary } from '@ngrx/entity/src/models';

@Component({
  selector: 'app-academic',
  templateUrl: './academic-dashboard.component.html',
  styleUrls: ['./academic-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AcademicDashboardComponent implements OnInit {

  students$ = new BehaviorSubject<Student[]>([]);
  classSubjects$ = new BehaviorSubject<SchoolSubject[]>(null);

  currentAcademicYear = (new Date()).getFullYear();

  academicYears: number[] = [ 
    ...range(1990, this.currentAcademicYear), 
    ...[this.currentAcademicYear]
  ].sort( (a, b) =>  b - a );

  academicTrimesters: string[] = ['First Term', 'Second Term', 'Third Term'];

  currentUser: User;
  academicClasses: AcademicClass[] = [];

  teacherClassLabel = '';
  isAdminUser = false;

  // SelectBox values
  selectedAcademicClass: AcademicClass;
  selectedAcademicYear: number;
  selectedAcademicTrimester: string;
  
  // Mark Sheet Status
  busyfetchingMarks: boolean;
  markSheetError: boolean;
  selectedAcademicClassChanged = false;
  userHasSearched = false;

  // Active Mark Sheet Marks
  marks$ = new BehaviorSubject<Mark[]>([]);

  constructor(
    private academicService: AcademicService,
    private store: Store<ApplicationState>,
    private snackBar: MatSnackBar
  ) {}

  getTeacherClass(teacher: User) {
    return `${teacher.teacherGrade + 1}${SchoolClass[teacher.teacherClass]}`;
  }

  ngOnInit() {

    for (let k = 0; k < Object.keys(SchoolGrade).length / 2; k++ ) {
      for ( let p = 0; p < Object.keys(SchoolClass).length / 2; p++) {
        this.academicClasses.push({
          grade: k,
          schoolClass: p,
          label: `${k + 1}${SchoolClass[p]}`
        });
      }
    }

    this.store.select('users').pipe(
      distinctUntilChanged(),
      tap(users => this.setDefaultsBasedOnUser(users.loggedInUser))
    ).subscribe();

  }

  setSubjectsAndStudent() {
    this.store.select('students')
      .pipe(
        first(),
        map( students => this.mapDictionaryToEntities(students.entities)),
        map( (studentsArray: Student[]) => studentsArray.filter( 
          student => student.grade === this.selectedAcademicClass.grade && 
          +student.studentClass === this.selectedAcademicClass.schoolClass
        )),
        tap( students => this.students$.next(students)),
        catchError( () => observableOf([]))
      )
      .subscribe();

    this.store.select('subjects')
      .pipe(
        first(),
        map( subjects => this.mapDictionaryToEntities(subjects.entities)),
        map( (subjects: SchoolSubject[]) => subjects.filter( subject => +subject.grade === this.selectedAcademicClass.grade) ),
        tap( subjects => this.classSubjects$.next(subjects)),
        catchError( () => observableOf([]))        
      )
      .subscribe();

  }

  mapDictionaryToEntities(dictionary: Dictionary<any>): Array<any> {
    const result = Object.keys(dictionary).map( k => dictionary[k] );
    return result;
  }

  setDefaultsBasedOnUser(loggedInUser: User) {
    this.currentUser = loggedInUser;
    this.isAdminUser = loggedInUser.role === UserRoles.Administrator;
    this.teacherClassLabel = this.getTeacherClass(loggedInUser);

    if ( !this.isAdminUser ) {
      this.selectedAcademicYear = this.currentAcademicYear;
      this.selectedAcademicClass = this.academicClasses
        .find( k => k.grade === loggedInUser.teacherGrade && k.schoolClass === loggedInUser.teacherClass);
    }

    this.setSubjectsAndStudent();
  }

  /**
   * Returns the text/string to be used on select option for school classes
   * @param academicClass : the current academic class option
   * @param teacherClass : Teacher/User's class
   * @param isAdminUser : Is the user an admin or not
   */
  selectClassOption(academicClass: string, teacherClass: string, isAdminUser: boolean) {
    
    if ( isAdminUser ) {
      return academicClass;
    }

    if (teacherClass === academicClass) {
      return `${teacherClass} (My Class)`;
    } else {
      return `${academicClass} (not allowed)`;
    }    
  }

  /**
   * Event fired when a user changes the academic class in the UI
   */
  academicClassChanged() {
    this.selectedAcademicClassChanged = true;
  }

  async getMarkSheet() {

    // If academic class has changed... Get new students and subjects
    if ( this.selectedAcademicClassChanged ) {
      this.setSubjectsAndStudent();
      this.selectedAcademicClassChanged = false;
    }

    if (!this.userHasSearched) {
      this.userHasSearched = true;
    }

    this.busyfetchingMarks = true;
    this.markSheetError = false;

    const result = await this.academicService
      .getMarkSheet(
        this.selectedAcademicClass.grade, 
        this.selectedAcademicClass.schoolClass, 
        this.selectedAcademicYear,
        this.selectedAcademicTrimester
      );

    if ( result.success === true ) {
      this.marks$.next( result.data );
    } else {
      this.markSheetError = true;
      this.snackBar.open(result.message, 'Retry', {duration: 3000});
    }

    this.busyfetchingMarks = false;

  }  

  saveMarks(marks: Mark[]) {

  }
}

interface AcademicClass {
  grade: SchoolGrade;
  schoolClass: SchoolClass;
  label: string;
}
