import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-newpasswordemail',
  templateUrl: './newpasswordemail.component.html',
  styleUrls: ['./newpasswordemail.component.css'],
})

/**
 * Changing the password of an existing user account is implemented in this class.
 * @author Burkart
 */
export class NewPasswordEmailComponent implements OnInit {
  // TODO: Input-Feld für Email hinzufügen
  newFormGroup: FormGroup;
  submitted = false;
  private loading: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.newFormGroup = this._formBuilder.group({
      // Validators to check the length of the passwords
      mailCtrl: ['', Validators.email],
    });
  }

  onSubmit() {
    // deactivate the registration button
    this.submitted = true;

    // stop here if form is invalid
    if (this.newFormGroup.invalid) {
      return;
    }

    // call the method to request a new password
    this.authenticationService.resetPassword(this.mailCtrl.value.toString())
      .catch( // catch the error-warnings if the method fails
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

    // if the new was successful
    this.alertService.success('Ihr Passwort wurde erfolgreich geändert!');
  }

  // getter for the email, old and new passwords
  get mailCtrl() { return this.newFormGroup.get('mailCtrl'); }
}