import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidation } from '../registration/registration.passwordvalidation';
import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})

/**
 * The registration of new users is implemented in this component
 * @author Burkart
 */
export class RegistrationComponent implements OnInit {

  registerFormGroup: FormGroup;
  submitted = false;
  hide_pw1 = true;
  hide_pw2 = true;
  loading: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.registerFormGroup = this._formBuilder.group({
      // Validators to check the syntax of the email-adress and the length of the password
      mailCtrl: ['', Validators.email],
      pwdCtrl: ['', Validators.minLength(8)],
      pwdrptCtrl: ['', Validators.minLength(8)],

    },
      {
        // validates the two passwords
        validator: PasswordValidation.Match('pwdCtrl', 'pwdrptCtrl'),
      });
  }

  onSubmit() {

    // deactivate the registration button
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerFormGroup.invalid) {
      return;
    }

    this.authenticationService.register(this.mailCtrl.value.toString(), this.pwdCtrl.value.toString())
      .catch( // catch the error warnings if the registration fails
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

    // if the registration was successful inform them to check their mails and activate their account
    this.alertService.success('Die Registrierung war erfolgreich! ' +
      'Ein Link zur Aktivierung Ihres Profils wurde an die von Ihnen angegebene Email-Adresse versandt.');
  }

  // getter for the email-adress and the two passwords to check if they match
  get mailCtrl() { return this.registerFormGroup.get('mailCtrl'); }

  get pwdCtrl() { return this.registerFormGroup.get('pwdCtrl'); }

  get pwdrptCtrl() { return this.registerFormGroup.get('pwdrptCtrl'); }

}
