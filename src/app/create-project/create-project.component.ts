import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray }  from '@angular/forms';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  stepperFormGroup1: FormGroup;
  stepperFormGroup2: FormGroup;
  stepperFormGroup3: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.stepperFormGroup1 = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
      descCtrl: ''
    });
    this.stepperFormGroup2 = this._formBuilder.group({
      secondCtrl: ''
    });
    this.stepperFormGroup3 = this._formBuilder.group({
      thirdCtrl: ''
    });
  }

}
