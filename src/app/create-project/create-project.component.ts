import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Project } from '../project-api';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  stepperFormGroup1: FormGroup;
  stepperFormGroup2: FormGroup;
  stepperFormGroup3: FormGroup;
  prevYear: number;
  newProject: Project;

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.newProject = {
      id: null,
      name: '',
      algorithm: 'fcf',
      baseYear: new Date().getFullYear() - 1,
      description: '',
      deterministic: true,
      iterations: 10000,
      prognosisLength: 5,
      timeSeries: []
    }
    this.prevYear = new Date().getFullYear() - 1;
    this.stepperFormGroup1 = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
      descCtrl: ''
    });
    this.stepperFormGroup2 = this._formBuilder.group({

    });
    this.stepperFormGroup3 = this._formBuilder.group({
      baseYearCtrl: [this.prevYear, Validators.required],
      req: ['', Validators.required]
    });
  }

  addYear() {
    let nextYear : number;
    if(this.newProject.timeSeries.length > 0) {
      nextYear = Math.min(...this.newProject.timeSeries.map(function(obj){return obj.year}));
    } else {
      nextYear = this.stepperFormGroup3.controls.baseYearCtrl.value as number;
    }
    
    this.newProject.timeSeries.push({
      year: nextYear-1,
      externalCapital: 0,
      fcf: 0
    });
  }
}
