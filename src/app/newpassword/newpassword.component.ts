import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { PasswordValidation } from '../registration/registration.passwordvalidation';
import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';

@Component({
    selector: 'app-newpassword',
    templateUrl: './newpassword.component.html',
    styleUrls: ['./newpassword.component.css'],
  })

  /**
   * Changing the password of an existing user account is implemented in this class.
   * @author Burkart
   */
  export class NewPasswordComponent implements OnInit {

  [x: string]: any;
    newFormGroup: FormGroup;
    submitted = false;
    hide_pw1 = true;
    hide_pw2 = true;

    constructor(
      private _formBuilder: FormBuilder,
      private authenticationService: AuthenticationService,
      private alertService: AlertService) {}

    ngOnInit() {
      this.newFormGroup = this._formBuilder.group({
        // Validators to check the length of the passwords
        pwdNew1: ['', Validators.minLength(8)],
        pwdNew2: ['', Validators.minLength(8)],
      },
      {
        // validates the two passwords
        validator: PasswordValidation.Match('pwdNew1', 'pwdNew2'),
      });
    }

    onSubmit() {
      // deactivate the registration button
     this.submitted = true;

      // stop here if form is invalid
      if (this.newFormGroup.invalid) {
          return;
      }

      // call the method to new the password
      this.authenticationService.newpassword(this.pwdNew1.value.toString(), this.pwdNew2.value.toString())
      .catch( // catch the error-warnings if the method fails
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

      // if the new was successful
      this.alertService.success('Ihr Passwort wurde erfolgreich geändert!');
    }

    // getter for the old and new passwords
    get pwdNew1() { return this.newFormGroup.get('pwdNew1'); }

    get pwdNew2() { return this.newFormGroup.get('pwdNew2'); }
}
