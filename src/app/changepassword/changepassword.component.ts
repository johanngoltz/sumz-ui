import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

import { PasswordValidation } from 'src/app/registration/registration.passwordvalidation';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';

@Component({
    selector: 'app-changepassword',
    templateUrl: './changepassword.component.html',
    styleUrls: ['./changepassword.component.css'],
  })
  export class ChangePasswordComponent implements OnInit {
    
  [x: string]: any;
    resetFormGroup: FormGroup;
    hide_pw1 = true;
    hide_pw2 = true;
    hide_pw3 = true;
  
    constructor(
      private _formBuilder: FormBuilder, 
      private authenticationService: AuthenticationService,
      private alertService: AlertService) {}

    ngOnInit() {
      this.changeFormGroup = this._formBuilder.group({
        pwdOld: ['', Validators.minLength(8)],
        pwdNew: ['', Validators.minLength(8)],
        pwdNew2: ['', Validators.minLength(8)],

      },
      {
        validator: PasswordValidation.Match('pwdNew', 'pwdNew2'), // validates the two passwords
      });
    }

    onSubmit() {
     this.submitted = true;

      // stop here if form is invalid
      if (this.changeFormGroup.invalid) {
          return;
      }

      //call the method to change the password
      this.authenticationService.changepassword(this.pwdOld.value.toString(), this.pwdNew.value.toString(), this.pwdNew2.value.toString())
      .catch( //catch the error-warnings if the method fails
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

      //if the change was successful
      this.alertService.success("Ihr Passwort wurde erfolgreich geändert!");  
    }
  

    get pwdOld() { return this.changeFormGroup.get('pwdOld'); }

    get pwdNew() { return this.changeFormGroup.get('pwdNew'); }

    get pwdNew2() { return this.changeFormGroup.get('pwdNew2'); }

}