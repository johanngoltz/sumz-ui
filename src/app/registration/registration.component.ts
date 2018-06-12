import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

 
@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    //styleUrls: ['./registration.component.css'],
  })
  export class RegistrationComponent implements OnInit {
    
    registerFormGroup: FormGroup;
    hide = true;
  
    constructor(private _formBuilder: FormBuilder) { // <--- inject FormBuilder
    }
  
    ngOnInit() {
      this.registerFormGroup = this._formBuilder.group({
        mailCtrl: ['', Validators.email],
        pwdCtrl: '',
      });
    }
  
    get firstNameCtrl() { return this.registerFormGroup.get('firstNameCtrl'); }

    get lastNameCtrl() { return this.registerFormGroup.get('lastNameCtrl'); }

    get userNameCtrl() { return this.registerFormGroup.get('userNameCtrl'); }
  
    get pwdCtrl() { return this.registerFormGroup.get('pwdCtrl'); }
  
  }