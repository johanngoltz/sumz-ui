import {AbstractControl} from '@angular/forms';

/**
 * The validation of two passwords (if they match each other) is implemented in this class.
 * @author Burkart
 */
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
      } else {
        return null;   // if the passwords match
      }
    };
  }
}
