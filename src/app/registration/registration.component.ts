import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { PasswordValidation } from './registration.passwordvalidation';


@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css'],
  })
  export class RegistrationComponent implements OnInit {

    registerFormGroup: FormGroup;
    hide = true;

    constructor(private _formBuilder: FormBuilder) { }

    ngOnInit() {
      this.registerFormGroup = this._formBuilder.group({
        mailCtrl: ['', Validators.email],

        pwdCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        pwdrptCtrl: ['', Validators.required],

      },
      {
        validator: PasswordValidation.Match('pwdCtrl', 'pwdrptCtrl'), // validates the two passwords
      });
    }

    get mailCtrl() { return this.registerFormGroup.get('mailCtrl'); }

    get pwdCtrl() { return this.registerFormGroup.get('pwdCtrl'); }

    get pwdrptCtrl() { return this.registerFormGroup.get('pwdrptCtrl'); }
}
