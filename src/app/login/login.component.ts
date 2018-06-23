import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
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

    // reset login status
    this.authenticationService.logout();

    this.authenticationService.login(this.mailCtrl.value.toString(), this.pwdCtrl.value.toString(), 'password');
  }

  get mailCtrl() { return this.loginFormGroup.get('mailCtrl'); }

  get pwdCtrl() { return this.loginFormGroup.get('pwdCtrl'); }
}
