import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidation } from '../registration/registration.passwordvalidation';
import { AlertService } from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';

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
  hide_pw1 = true;
  hide_pw2 = true;
  hide_pw3 = true;
  submitted: boolean;
  loading: boolean;
  changeFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.changeFormGroup = this._formBuilder.group({

      // Validators to check the length of the password
      pwdOld: ['', Validators.minLength(8)],
      pwdNew: ['', Validators.minLength(8)],
      pwdNew2: ['', Validators.minLength(8)],

    },
      {
        // validates the two passwords
        validator: PasswordValidation.Match('pwdNew', 'pwdNew2'),
      });
  }

  onSubmit() {

    // deactivate the change password button
    this.submitted = true;

    // stop here if form is invalid
    if (this.changeFormGroup.invalid) {
      return;
    }

      // call the method to change the password
      this.authenticationService.changepassword(this.pwdOld.value.toString(), this.pwdNew.value.toString())
      .then( () => {
          // if the change was successful
          this.alertService.success('Ihr Passwort wurde erfolgreich geändert!');
      })
      .catch( // catch the error-warnings if the method fails
        error => {
          this.alertService.error(error);
          this.loading = false;
        });


  }

  // getter for the old and new passwords
  get pwdOld() { return this.changeFormGroup.get('pwdOld'); }

  get pwdNew() { return this.changeFormGroup.get('pwdNew'); }

  get pwdNew2() { return this.changeFormGroup.get('pwdNew2'); }

}
