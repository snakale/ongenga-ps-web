import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {

      const password = AC.get('newPassword').value;
      const confirmPassword = AC.get('newPasswordConfirm').value;

      if (password !== confirmPassword) {
          AC.get('newPasswordConfirm').setErrors( {MatchPassword: true} );
      } else {
          return null;
      }

  }

}
