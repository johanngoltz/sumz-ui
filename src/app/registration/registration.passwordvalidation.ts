import {AbstractControl} from '@angular/forms';

export class PasswordValidation {

  /**
   * Match two passwords if they are the same, used for the registration of new users
   * @param password1 the first password
   * @param password2 the second password
   * @returns {(AC: AbstractControl) => any}
   * @constructor
   */
  static Match(password1: string, password2: string) {
    return (AC: AbstractControl) => {
      const firstControlValue = AC.get(password1).value; // get the valies of the password1 field
      const secondControlValue = AC.get(password2).value; // get the value of the password2 field
      if (firstControlValue !== secondControlValue) {
        AC.get(password2).setErrors({MatchFields: true});
        console.log(false);
      } else {
        console.log(true);
        return null;   // if the passwords match
      }
    };
  }
}
