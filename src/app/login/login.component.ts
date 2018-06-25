import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.loginFormGroup = this.formBuilder.group({
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
    this.authenticationService.logout();

    this.authenticationService.login(this.mailCtrl.value.toString(), this.pwdCtrl.value.toString(), 'password');
  }

  get mailCtrl() { return this.loginFormGroup.get('mailCtrl'); }

  get pwdCtrl() { return this.loginFormGroup.get('pwdCtrl'); }
}
