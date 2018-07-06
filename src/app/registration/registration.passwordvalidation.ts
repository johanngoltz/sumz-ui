import {AbstractControl} from '@angular/forms';

/**
 * The validation of two strings (if they match each other) is implemented in this class.
 * @author Burkart
 */
export class PasswordValidation {

  /**
   * Compares two Strings if they are the same.
   * (Used for form field validation)
   * @param {string} input1 the first password
   * @param {string} input2 the second password
   * @returns {AbstractControl} AbstractControl
   */
  static Match(input1: string, input2: string) {
    return (AC: AbstractControl) => {
      const firstControlValue = AC.get(input1).value; // get the valies of the password1 field
      const secondControlValue = AC.get(input2).value; // get the value of the password2 field
      if (firstControlValue !== secondControlValue) {
        AC.get(input2).setErrors({MatchFields: true});
      } else {
        return null;   // if the passwords match
      }
    };
  }
}
