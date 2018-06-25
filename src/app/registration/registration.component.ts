import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
<<<<<<< HEAD
import { PasswordValidation } from 'src/app/registration/registration.passwordvalidation';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';


 
=======
import { PasswordValidation } from './registration.passwordvalidation';


>>>>>>> 85c0182e0b370f0b2b5cf9f0b44bb991952454ea
@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css'],
  })
  export class RegistrationComponent implements OnInit {
<<<<<<< HEAD
    
  [x: string]: any;
    registerFormGroup: FormGroup;
    hide = true;
  
    constructor(private _formBuilder: FormBuilder, private authenticationService: AuthenticationService) { 
      
    }
=======

    registerFormGroup: FormGroup;
    hide = true;
>>>>>>> 85c0182e0b370f0b2b5cf9f0b44bb991952454ea

    constructor(private _formBuilder: FormBuilder) { }


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

<<<<<<< HEAD
    onSubmit() {
     // this.submitted = true;

      // stop here if form is invalid
      if (this.registerFormGroup.invalid) {
          return;
      }

      this.authenticationService.registration(this.mailCtrl.value.toString(), this.pwdCtrl.value.toString());
      console.log("fdsadgds");
    }
  
=======
>>>>>>> 85c0182e0b370f0b2b5cf9f0b44bb991952454ea
    get mailCtrl() { return this.registerFormGroup.get('mailCtrl'); }

    get pwdCtrl() { return this.registerFormGroup.get('pwdCtrl'); }

    get pwdrptCtrl() { return this.registerFormGroup.get('pwdrptCtrl'); }

}
