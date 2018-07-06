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
  hidePw1 = true;
  hidePw2 = true;
  loading = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService) { }

  ngOnInit() {
    this.registerFormGroup = this._formBuilder.group({
      // Validators to check the inputs
      // Note: Backend uses same validators
      mailCtrl: ['', Validators.email],
      pwdCtrl: ['', [
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).*')]],
      pwdrptCtrl: ['', Validators.minLength(8)],
    }, {
        // validates the two passwords
        validator: PasswordValidation.Match('pwdCtrl', 'pwdrptCtrl'),
      });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.registerFormGroup.invalid) {
      return;
    }

    // deactivate the registration button
    this.loading = true;

    this._authenticationService.register(this.mailCtrl.value.toString(), this.pwdCtrl.value.toString())
      .catch( // catch the error warnings if the registration fails
        error => {
          this._alertService.error(error);
          this.loading = false;
        });

    // if the registration was successful inform them to check their mails and activate their account
    this._alertService.success('Die Registrierung war erfolgreich! ' +
      'Ein Link zur Aktivierung Ihres Profils wurde an die von Ihnen angegebene Email-Adresse versandt.');
  }

  // getter for the email-adress and the two passwords to check if they match
  get mailCtrl() { return this.registerFormGroup.get('mailCtrl'); }

  get pwdCtrl() { return this.registerFormGroup.get('pwdCtrl'); }

  get pwdrptCtrl() { return this.registerFormGroup.get('pwdrptCtrl'); }

}
