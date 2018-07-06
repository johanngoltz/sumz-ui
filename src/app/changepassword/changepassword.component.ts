import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidation } from '../registration/registration.passwordvalidation';
import { AlertService } from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
})

/**
 * Changing the password of an existing user account is implemented in this class.
 * @author Burkart
 */
export class ChangePasswordComponent implements OnInit {

  resetFormGroup: FormGroup;
  hidePw1 = true;
  hidePw2 = true;
  hidePw3 = true;
  loading = false;
  changeFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.changeFormGroup = this._formBuilder.group({
      // Validators to check the inputs
      // Note: Backend uses same validators
      pwdOld: [''],
      pwdNew: ['', [
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).*')]],
      pwdNew2: [''],
    }, {
      // validates the two passwords
      validator: PasswordValidation.Match('pwdNew', 'pwdNew2'),
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.changeFormGroup.invalid) {
      return;
    }

    // deactivate the change password button
    this.loading = true;

    // call the method to change the password
    this._authenticationService.changepassword(this.pwdOld.value.toString(), this.pwdNew.value.toString())
    .then( () => {
        // if the change was successful
        this._alertService.success('Ihr Passwort wurde erfolgreich geändert! Bitte melden Sie sich mit dem neuen Passwort an.');
        this._authenticationService.logout();
        this._router.navigate(['/login']); // relog with the new password
    })
    .catch( // catch the error-warnings if the method fails
      error => {
        this._alertService.error(error);
        this.loading = false;
      });
  }

  // getter for the old and new passwords
  get pwdOld() { return this.changeFormGroup.get('pwdOld'); }

  get pwdNew() { return this.changeFormGroup.get('pwdNew'); }

  get pwdNew2() { return this.changeFormGroup.get('pwdNew2'); }

}
