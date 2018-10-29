import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRoles } from '../../../../enums/roles.enum';
import { User } from '../../../../models/user.interface';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileFormComponent implements OnInit, OnChanges {

  @Input() user: User;
  @Output() formSubmit = new EventEmitter<any>();

  userForm: FormGroup;
  userRoles = UserRoles;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ( changes.user.currentValue !== null ) {
      if ( changes.user.currentValue !== changes.user.previousValue ) { // If there's actually a change
        if ( this.userForm !== null && this.userForm !== undefined ) {
          this.setDefaultFormValues(changes.user.currentValue);
        }        
      }
    }
  }

  submitForm() {
    this.formSubmit.emit(this.userForm.value);
  }

  setDefaultFormValues(user) {
    this.userForm.patchValue({
      names: user.names,
      surname: user.surname,
      email: user.email,
      role: user.role
    });
    this.cdr.detectChanges();
  }

  ngOnInit() {
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
      ]]
    });

    if (this.user !== null) {
      this.setDefaultFormValues(this.user);
    }
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

}
