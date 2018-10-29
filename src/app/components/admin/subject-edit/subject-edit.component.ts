import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SchoolSubjectsState } from '../../../state/subjects/adaptor';
import { SchoolSubject } from '../../../models/subject.interface';
import { Observable, of as ObservableOf } from 'rxjs';
import { AddSchoolSubject, UpdateSchoolSubject } from '../../../state/subjects/actions';
import { tap, distinctUntilChanged, map, catchError } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SchoolGrade } from '../../../enums/grades.enum';
import { AppReturnType } from '../../../models/return-type.interface';
import { MatSnackBar } from '@angular/material';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-subject-edit',
  templateUrl: './subject-edit.component.html',
  styleUrls: ['./subject-edit.component.scss']
})
export class SubjectEditComponent implements OnInit {

  subjectId: number;
  subject$: Observable<SchoolSubject>;
  pageTitle = 'Add New Subject';
  schoolSubjectForm: FormGroup;
  subjectGrades = SchoolGrade;
  busySubmitting = false;
  isNewSchoolSubject: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private store: Store<SchoolSubjectsState>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.subjectId = this.activatedRoute.snapshot.params.id;
    this.isNewSchoolSubject = isNaN(this.subjectId);

    this.schoolSubjectForm = this.formBuilder.group({
      name: ['', [
        Validators.required
      ]],
      grade: [null, [
        Validators.required
      ]]
    });

    this.patchForm();
  }

  patchForm() {

    if (this.isNewSchoolSubject) {
      return;
    }
    
    this.subjectId = +this.subjectId;
    this.store.select('subjects').pipe(
      map( (schoolSubjectState: SchoolSubjectsState) => schoolSubjectState.entities[this.subjectId]),
      catchError( () => ObservableOf(null)),
      distinctUntilChanged(),
      tap( (schoolSubject: SchoolSubject) => {
        if ( schoolSubject !== null && schoolSubject !== undefined ) {
          this.pageTitle = `${schoolSubject.name} - Grade ${(+schoolSubject.grade) + 1}`;
          this.schoolSubjectForm.patchValue({name: schoolSubject.name, grade: +schoolSubject.grade});
        } 
      })
    ).subscribe();
    
  }

  get name() {
    return this.schoolSubjectForm.get('name');
  }

  async saveSchoolSubject() {
    
    this.busySubmitting = true;
    const result = await this.saveFormDataToDB();

    if (result.success) {
      this.updateStore(result); // First update the store before resetting the form
      this.resetForm();      
    } 

    this.notifyUserOfSubmitResult(result);
    this.busySubmitting = false;
  }

  notifyUserOfSubmitResult(result: AppReturnType) {
    if (result.success) {
      if (this.isNewSchoolSubject) {
        this.snackBar.open('Successfully added new subject', '', {duration: 3000});
      } else {
        this.snackBar.open('Successfully updated subject information', '', {duration: 5000});
      }   
    } else {
      this.snackBar.open(result.message, '', {duration: 5000});
    }
  }

  saveFormDataToDB() {
    const subject = this.schoolSubjectForm.value;
    if (this.isNewSchoolSubject) {     
      return this.adminService.saveNewSubject(subject);
    } else {
      return this.adminService.updateSchoolSubject({...{id: this.subjectId}, ...subject});
    }
  }

  updateStore(result) {
    if (this.isNewSchoolSubject) {
      this.store.dispatch( new AddSchoolSubject({subject: result.data}));
    } else {
      this.store.dispatch( new UpdateSchoolSubject({subject: {id: this.subjectId, changes: this.schoolSubjectForm.value}}));
    }
  }

  resetForm() {
    if ( this.isNewSchoolSubject ) {
      this.schoolSubjectForm.reset();
    }
  }

  goBack() {
    this.location.back();
  }

}
