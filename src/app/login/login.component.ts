import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  loading = false;
  hide = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService,
  ) { }

  ngOnInit() {
    this.loginFormGroup = this._formBuilder.group({
      mailCtrl: ['', Validators.email],
      pwdCtrl: '',
    });
  }

  onSubmit() {
    // abort if form is invalid
    if (this.loginFormGroup.invalid) {
      return;
    }

    // disable login button
    this.loading = true;

    // reset login status
    this._authenticationService.logout();

    this._authenticationService.login(this.mailCtrl.value.toString(), this.pwdCtrl.value.toString())
      .catch(
        error => {
          this._alertService.error(error);
          this.loading = false;
        });
  }

  get mailCtrl() { return this.loginFormGroup.get('mailCtrl'); }

  get pwdCtrl() { return this.loginFormGroup.get('pwdCtrl'); }
}
