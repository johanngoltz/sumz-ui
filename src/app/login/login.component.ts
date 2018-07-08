import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

/**
 * Functionality to login a known user
 */
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  loading = false;
  hide = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService,
    private _router: Router,
    private _route: ActivatedRoute,
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

    this._authenticationService.login(this.mailCtrl.value.toString(), this.pwdCtrl.value.toString())
      .subscribe(
        () => {
          // navigate to return url from route parameters or default to '/'
          this._router.navigate([this._route.snapshot.queryParams['returnUrl'] || '/']);
        },
        (error) => {
          this._alertService.error(error.response.data.message || error);
        },
        () => {
          this.loading = false;
        }
      );
  }

  get mailCtrl() { return this.loginFormGroup.get('mailCtrl'); }

  get pwdCtrl() { return this.loginFormGroup.get('pwdCtrl'); }
}
