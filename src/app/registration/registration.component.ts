import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

import { PasswordValidation } from '../registration/registration.passwordvalidation';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';


@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css'],
  })
  export class RegistrationComponent implements OnInit {

  [x: string]: any;
    registerFormGroup: FormGroup;
    hide_pw1 = true;
    hide_pw2 = true;

    constructor(private _formBuilder: FormBuilder, private authenticationService: AuthenticationService) {

    }

    ngOnInit() {
      this.registerFormGroup = this._formBuilder.group({
        mailCtrl: ['', Validators.email],
        pwdCtrl: ['', Validators.minLength(8)],
        pwdrptCtrl: ['', Validators.minLength(8)],

      },
      {
        validator: PasswordValidation.Match('pwdCtrl', 'pwdrptCtrl'), // validates the two passwords
      });
    }

    onSubmit() {
     this.submitted = true;

      // stop here if form is invalid
      if (this.registerFormGroup.invalid) {
          return;
      }

      this.authenticationService.registration(this.mailCtrl.value.toString(), this.pwdCtrl.value.toString());
      console.log('fdsadgds');
    }

    get mailCtrl() { return this.registerFormGroup.get('mailCtrl'); }

    get pwdCtrl() { return this.registerFormGroup.get('pwdCtrl'); }

    get pwdrptCtrl() { return this.registerFormGroup.get('pwdrptCtrl'); }

}
