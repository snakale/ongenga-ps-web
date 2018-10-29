import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-password-form',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss']
})
export class UserPasswordFormComponent implements OnInit {

  @Output() formSubmit = new EventEmitter<any>();
  passwordForm: FormGroup;  
  passwordsMatch = false;

  oldPasswordVisibility = false;
  newPasswordVisibility = false;
  newPasswordConfirmVisibility = false;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  toggleOldPasswordVisibility() {
    this.oldPasswordVisibility = !this.oldPasswordVisibility;
  }

  toggleNewPasswordVisibility() {
    this.newPasswordVisibility = !this.newPasswordVisibility;
  }

  toggleNewPasswordConfirmVisibility() {
    this.newPasswordConfirmVisibility = !this.newPasswordConfirmVisibility;
  }

  get oldPassword() {
    return this.passwordForm.get('oldPassword');
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  get newPasswordConfirm() {
    return this.passwordForm.get('newPasswordConfirm');
  }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', [
        Validators.required
      ]],
      newPassword: ['', [
          Validators.required
      ]],
      newPasswordConfirm: ['', [
        Validators.required
      ]]
    });

    this.passwordForm.valueChanges.pipe(
      tap(values => this.passwordsMatch = values.newPassword === values.newPasswordConfirm)
    ).subscribe();
  }

  submitForm() {
    this.formSubmit.emit(this.passwordForm.value);
  }

}
