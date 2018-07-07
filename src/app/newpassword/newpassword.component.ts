import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidation } from '../registration/registration.passwordvalidation';
import { AlertService } from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.css'],
})

/**
 * Changing the password of an existing user account is implemented in this class after the reset
 * in component newpasswordemail.
 * @author Burkart
 */
export class NewPasswordComponent implements OnInit {

  newFormGroup: FormGroup;
  hidePw1 = true;
  hidePw2 = true;
  loading = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService, private router: Router) { }

  ngOnInit() {
    this.newFormGroup = this._formBuilder.group({
      // Validators to check the inputs
      // Note: Backend uses same validators
      pwdNew1: ['', [
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).*')]],
      pwdNew2: [''],
    },
      {
        // validates the two passwords
        validator: PasswordValidation.Match('pwdNew1', 'pwdNew2'),
      });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.newFormGroup.invalid) {
      return;
    }

    // deactivate the registration button
    this.loading = true;

    // FIXME: in Observables ändern
    // // call the method to request a new password
    // this._authenticationService.postNewPassword(this.pwdNew1.value.toString())
    //   .then(() => {
    //     // if the change was successful
    //     this._alertService.success('Ihr neues Passwort wurde erfolgreich gesetzt. Bitte loggen Sie sich mit dem neuen Passwort ein');
    //     this._authenticationService.logout();
    //     this.router.navigate(['/login']); // relog with the new password
    //   })
    //   .catch( // catch the error-warnings if the method fails
    //     error => {
    //       this._alertService.error(error);
    //       this.loading = false;
    //     });

    // if the new was successful
    this._alertService.success('Ihr Passwort wurde erfolgreich geändert!');
  }

  // getter for the email, old and new passwords
  get pwdNew1() { return this.newFormGroup.get('pwdNew1'); }

  get pwdNew2() { return this.newFormGroup.get('pwdNew2'); }
}
