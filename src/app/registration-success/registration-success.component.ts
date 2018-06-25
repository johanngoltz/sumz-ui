import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { PasswordValidation } from 'src/app/registration/registration.passwordvalidation';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';


 
@Component({
    selector: 'app-registration-success',
    templateUrl: './registration-success.component.html',
    //styleUrls: ['./registration.component.css'],
  })
  export class RegistrationSuccessComponent implements OnInit {
    
  [x: string]: any;
    registerFormGroup: FormGroup;
    hide = true;
  
    constructor(private _formBuilder: FormBuilder, private authenticationService: AuthenticationService) { 
      
    }

  
    ngOnInit() {
     

     
    }

  
  }