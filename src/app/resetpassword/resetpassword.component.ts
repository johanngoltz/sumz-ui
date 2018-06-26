import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

import { PasswordValidation } from 'src/app/registration/registration.passwordvalidation';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
    selector: 'app-resetpassword',
    templateUrl: './resetpassword.component.html',
    styleUrls: ['./resetpassword.component.css'],
  })
  export class ResetPasswordComponent implements OnInit {
    
  [x: string]: any;
    resetFormGroup: FormGroup;
    hide = true;
  
    constructor(private _formBuilder: FormBuilder, private authenticationService: AuthenticationService) { 
      
    }

    ngOnInit() {
      this.resetFormGroup = this._formBuilder.group({
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
      if (this.resetFormGroup.invalid) {
          return;
      }

      this.authenticationService.resetpassword(this.pwdOld.value.toString(), this.pwdNew.value.toString(), this.pwdNew2.value.toString());
    }
  

    get pwdOld() { return this.resetFormGroup.get('pwdOld'); }

    get pwdNew() { return this.resetFormGroup.get('pwdNew'); }

    get pwdNew2() { return this.resetFormGroup.get('pwdNew2'); }

}