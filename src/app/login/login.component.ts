import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  hide = true;

  constructor(private _formBuilder: FormBuilder) { // <--- inject FormBuilder
  }

  ngOnInit() {
    this.loginFormGroup = this._formBuilder.group({
      mailCtrl: ['', Validators.email],
      pwdCtrl: '',
    });
  }

  get mailCtrl() { return this.loginFormGroup.get('mailCtrl'); }

  get pwdCtrl() { return this.loginFormGroup.get('pwdCtrl'); }
}
